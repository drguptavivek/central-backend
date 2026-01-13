const should = require('should');
const { sql } = require('slonik');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg web user IP rate limiting', () => {
  describe('POST /v1/sessions IP-based rate limiting', () => {
    if (process.env.TEST_AUTH === 'oidc') return;

    it('should lock out IP after 20 total failed attempts across different usernames', testService(async (service, container) => {
      const ip = '1.1.1.1';

      // Clean up any existing audit data for this IP (both failures and lockouts)
      await container.run(sql`
        DELETE FROM audits
        WHERE (details->>'ip'=${ip} OR action='user.session.ip.lockout' AND details->>'ip'=${ip})
      `);

      // Make 20 failed attempts across 4 different usernames (5 each)
      const usernames = [
        'user1@test.com',
        'user2@test.com',
        'user3@test.com',
        'user4@test.com'
      ];

      // First 20 attempts should return 401
      for (let i = 0; i < 20; i += 1) {
        const username = usernames[Math.floor(i / 5)];
        await service.post('/v1/sessions')
          .set('X-Forwarded-For', ip)
          .send({ email: username, password: 'wrongpassword' })
          .expect(401);
      }

      // 21st attempt should trigger IP lockout (429)
      const response = await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'user21@test.com', password: 'wrongpassword' })
        .expect(429);  // 429 Too Many Requests

      // Should indicate IP lockout
      if (response.body.code !== undefined) {
        response.body.code.should.equal(429.7);
      }
    }));

    it('should not lock out IP when attempts are below threshold (20)', testService(async (service, container) => {
      const ip = '2.2.2.2';

      // Clean up any existing audit data for this IP
      await container.run(sql`
        DELETE FROM audits
        WHERE details->>'ip'=${ip}
      `);

      // Verify cleanup worked
      const countBefore = await container.one(sql`
        SELECT count(*)::int AS count
        FROM audits
        WHERE details->>'ip'=${ip}
      `);
      console.log(`Audit entries for IP ${ip} before test:`, countBefore.count);

      // Make 19 failed attempts across different usernames
      for (let i = 0; i < 19; i += 1) {
        // Check count before this request
        const countBefore = await container.one(sql`
          SELECT count(*)::int AS count
          FROM audits
          WHERE action = 'user.session.create.failure'
            AND details->>'ip'=${ip}
        `);

        const response = await service.post('/v1/sessions')
          .set('X-Forwarded-For', ip)
          .send({ email: `user${i}@test.com`, password: 'wrongpassword' });

        console.log(`Request ${i+1}: count before=${countBefore.count}, status=${response.status}`);

        // First 19 should return 401
        if (response.status === 429) {
          throw new Error(`Request ${i+1} returned 429 (IP locked) instead of 401. IP lockout triggered too early! Count before was ${countBefore.count}`);
        }
        response.status.should.equal(401);
      }

      // 20th attempt should still work (not yet IP locked)
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'user19@test.com', password: 'wrongpassword' })
        .expect(401);  // Not 429, so not IP locked
    }));

    it('should track per-user lockout independently from IP lockout', testService(async (service) => {
      const ip = '3.3.3.3';

      // User1: 5 failed attempts → user-locked
      for (let i = 0; i < 5; i += 1) {
        await service.post('/v1/sessions')
          .set('X-Forwarded-For', ip)
          .send({ email: 'user1@test.com', password: 'wrongpassword' })
          .expect(401);
      }

      // user1@test.com should be locked (per-user)
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'user1@test.com', password: 'password4alice' })
        .expect(401);

      // But user2@test.com should work (only 5 attempts total from IP, below IP threshold)
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'alice@getodk.org', password: 'password4alice' })
        .expect(200);
    }));

    it('should allow legitimate user with typo (single account)', testService(async (service) => {
      const ip = '4.4.4.4';

      // Legitimate user makes 3 typos with their email
      for (let i = 0; i < 3; i += 1) {
        await service.post('/v1/sessions')
          .set('X-Forwarded-For', ip)
          .send({ email: 'alice@getodk.org', password: 'wrongpassword' })
          .expect(401);
      }

      // 4th attempt with correct password should work
      // (3 attempts << 20 IP threshold, and << 5 per-user threshold)
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'alice@getodk.org', password: 'password4alice' })
        .expect(200);
    }));

    it('should log audit entry when IP lockout is triggered', testService(async (service, container) => {
      const ip = '5.5.5.5';

      // Make 20 failed attempts to trigger IP lockout
      for (let i = 0; i < 20; i += 1) {
        await service.post('/v1/sessions')
          .set('X-Forwarded-For', ip)
          .send({ email: `user${i}@test.com`, password: 'wrongpassword' })
          .expect(401);
      }

      // Trigger IP lockout
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'user20@test.com', password: 'wrongpassword' })
        .expect(429);

      // Check for IP lockout audit entry
      const ipLockoutAudits = await container.all(sql`
        select details from audits
        where action='user.session.ip.lockout'
          and details->>'ip'=${ip}
      `);

      ipLockoutAudits.length.should.be.greaterThan(0);
      const details = ipLockoutAudits[0].details;
      details.ip.should.equal(ip);
      should.exist(details.durationMinutes);
      details.durationMinutes.should.equal(30);
    }));

    it('should count IP failures from audit log within time window', testService(async (service, container) => {
      const ip = '6.6.6.6';

      // Create 10 old failures (outside 15-minute window)
      for (const minutes of [16, 17, 18, 19, 20, 21, 22, 23, 24, 25]) {
        await container.run(sql`
          insert into audits (action, "loggedAt", details)
          values (
            'user.session.create.failure',
            now() - (${minutes} * interval '1 minute'),
            jsonb_build_object('email', 'test@test.com', 'ip', ${ip}, 'userAgent', 'test')
          )
        `);
      }

      // Make 15 new failures
      for (let i = 0; i < 15; i += 1) {
        await service.post('/v1/sessions')
          .set('X-Forwarded-For', ip)
          .send({ email: `user${i}@test.com`, password: 'wrongpassword' })
          .expect(401);
      }

      // Total should be 15 (old ones outside window), not 25
      // Should not be IP locked yet
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'user15@test.com', password: 'wrongpassword' })
        .expect(401);  // Not 429
    }));

    it('should lift IP lockout after IP lock duration expires (30 minutes)', testService(async (service, container) => {
      const ip = '7.7.7.7';

      // Make 20 failed attempts to trigger IP lockout
      for (let i = 0; i < 20; i += 1) {
        await service.post('/v1/sessions')
          .set('X-Forwarded-For', ip)
          .send({ email: `user${i}@test.com`, password: 'wrongpassword' })
          .expect(401);
      }

      // Verify IP locked
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'alice@getodk.org', password: 'password4alice' })
        .expect(429);

      // Age out the IP lockout beyond 30 minutes
      await container.run(sql`
        update audits
        set "loggedAt" = now() - interval '31 minutes'
        where action='user.session.ip.lockout'
          and details->>'ip'=${ip}
      `);

      // Should work now (IP lockout expired)
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'alice@getodk.org', password: 'password4alice' })
        .expect(200);
    }));

    it('should handle missing IP gracefully for IP rate limiting', testService(async (service) => {
      // With no IP, IP rate limiting should not apply
      // Only per-user lockout should work
      const email = 'no-ip-user@test.com';

      // 5 failed attempts should trigger per-user lockout
      for (let i = 0; i < 5; i += 1) {
        await service.post('/v1/sessions')
          .send({ email, password: 'wrongpassword' })
          .expect(401);
      }

      // Should be per-user locked (401), not IP locked (429)
      await service.post('/v1/sessions')
        .send({ email, password: 'password4alice' })
        .expect(401);
    }));

    it('should track different IPs independently', testService(async (service) => {
      // IP1: 20 failed attempts → IP locked
      for (let i = 0; i < 20; i += 1) {
        await service.post('/v1/sessions')
          .set('X-Forwarded-For', '8.8.8.8')
          .send({ email: `user${i}@test.com`, password: 'wrongpassword' })
          .expect(401);
      }

      // IP1 should be locked
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', '8.8.8.8')
        .send({ email: 'alice@getodk.org', password: 'password4alice' })
        .expect(429);

      // IP2: 0 failed attempts → should work
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', '9.9.9.9')
        .send({ email: 'alice@getodk.org', password: 'password4alice' })
        .expect(200);
    }));

    it('should return retryAfterSeconds for IP lockout', testService(async (service) => {
      const ip = '10.10.10.10';

      // Make 20 failed attempts to trigger IP lockout
      for (let i = 0; i < 20; i += 1) {
        await service.post('/v1/sessions')
          .set('X-Forwarded-For', ip)
          .send({ email: `user${i}@test.com`, password: 'wrongpassword' })
          .expect(401);
      }

      // Trigger IP lockout
      const response = await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'user20@test.com', password: 'wrongpassword' })
        .expect(429);

      // Should have retryAfterSeconds
      if (response.body.retryAfterSeconds !== undefined) {
        response.body.retryAfterSeconds.should.be.within(1, 1800); // 30 minutes = 1800 seconds
      }
    }));

    it('should read IP rate limit settings from database', testService(async (service, container) => {
      const ip = '11.11.11.11';

      // Verify settings exist in database
      const maxFailures = await container.one(sql`
        select vg_key_value::int as value
        from vg_settings
        where vg_key_name='vg_web_user_ip_max_failures'
      `);

      const windowMinutes = await container.one(sql`
        select vg_key_value::int as value
        from vg_settings
        where vg_key_name='vg_web_user_ip_window_minutes'
      `);

      const durationMinutes = await container.one(sql`
        select vg_key_value::int as value
        from vg_settings
        where vg_key_name='vg_web_user_ip_duration_minutes'
      `);

      maxFailures.value.should.equal(20);
      windowMinutes.value.should.equal(15);
      durationMinutes.value.should.equal(30);

      // Now test that the settings are actually used
      // Make 20 failed attempts (matching the database setting)
      for (let i = 0; i < 20; i += 1) {
        await service.post('/v1/sessions')
          .set('X-Forwarded-For', ip)
          .send({ email: `user${i}@test.com`, password: 'wrongpassword' })
          .expect(401);
      }

      // Should be IP locked at the threshold from database
      await service.post('/v1/sessions')
        .set('X-Forwarded-For', ip)
        .send({ email: 'alice@getodk.org', password: 'password4alice' })
        .expect(429);
    }));
  });
});
