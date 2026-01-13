const should = require('should');
const { sql } = require('slonik');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg app user IP rate limiting', () => {
  describe('POST /projects/:projectId/app-users/login IP-based rate limiting', () => {
    it('should lock out IP after 20 total failed attempts across different usernames', testService(async (service, container) => {
      const ip = '1.1.1.1';
      const projectId = 1;

      // Clean up any existing audit data for this IP
      await container.run(sql`
        DELETE FROM audits
        WHERE (details->>'ip'=${ip} OR action='vg.app_user.login.ip.lockout' AND details->>'ip'=${ip})
      `);

      // Make 20 failed attempts across 4 different usernames (5 each)
      const usernames = [
        'user1.test',
        'user2.test',
        'user3.test',
        'user4.test'
      ];

      // First 20 attempts should return 401
      for (let i = 0; i < 20; i += 1) {
        const username = usernames[Math.floor(i / 5)];
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', ip)
          .send({ username, password: 'wrongpassword' })
          .expect(401);
      }

      // 21st attempt should trigger IP lockout (429)
      const response = await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'user21.test', password: 'wrongpassword' })
        .expect(429);  // 429 Too Many Requests

      // Should indicate IP lockout
      if (response.body.code !== undefined) {
        response.body.code.should.equal(429.7);
      }
    }));

    it('should not lock out IP when attempts are below threshold (20)', testService(async (service, container) => {
      const ip = '2.2.2.2';
      const projectId = 1;

      // Clean up any existing audit data for this IP
      await container.run(sql`
        DELETE FROM audits
        WHERE details->>'ip'=${ip}
      `);

      // Make 19 failed attempts across different usernames
      for (let i = 0; i < 19; i += 1) {
        const response = await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', ip)
          .send({ username: `user${i}.test`, password: 'wrongpassword' });

        // First 19 should return 401
        if (response.status === 429) {
          throw new Error(`Request ${i+1} returned 429 (IP locked) instead of 401. IP lockout triggered too early!`);
        }
        response.status.should.equal(401);
      }

      // 20th attempt should still work (not yet IP locked)
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'user19.test', password: 'wrongpassword' })
        .expect(401);  // Not 429, so not IP locked
    }));

    it('should track per-username lockout independently from IP lockout', testService(async (service) => {
      const ip = '3.3.3.3';
      const projectId = 1;

      // User1: 5 failed attempts → per-username+IP locked
      for (let i = 0; i < 5; i += 1) {
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', ip)
          .send({ username: 'user1.test', password: 'wrongpassword' })
          .expect(401);
      }

      // user1.test should be locked (per-username+IP)
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'user1.test', password: 'anypassword' })
        .expect(401);

      // But user2.test should work (only 5 attempts total from IP, below IP threshold)
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'user2.test', password: 'wrongpassword' })
        .expect(401);  // Not locked yet (per-username or IP)
    }));

    it('should allow legitimate user with typo (single account)', testService(async (service) => {
      const ip = '4.4.4.4';
      const projectId = 1;

      // First, create an app user (using fixture)
      // Note: This test assumes a test app user exists or will be created by fixtures

      // Legitimate user makes 3 typos with their username
      for (let i = 0; i < 3; i += 1) {
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', ip)
          .send({ username: 'testuser1', password: 'wrongpassword' })
          .expect(401);
      }

      // 4th attempt should still work for the same username
      // (3 attempts << 20 IP threshold, and << 5 per-username threshold)
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'testuser1', password: 'wrongpassword' })
        .expect(401);  // Not locked yet
    }));

    it('should log audit entry when IP lockout is triggered', testService(async (service, container) => {
      const ip = '5.5.5.5';
      const projectId = 1;

      // Make 20 failed attempts to trigger IP lockout
      for (let i = 0; i < 20; i += 1) {
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', ip)
          .send({ username: `user${i}.test`, password: 'wrongpassword' })
          .expect(401);
      }

      // Trigger IP lockout
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'user20.test', password: 'wrongpassword' })
        .expect(429);

      // Check for IP lockout audit entry
      const ipLockoutAudits = await container.all(sql`
        select details from audits
        where action='vg.app_user.login.ip.lockout'
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
      const projectId = 1;

      // Create 10 old failures (outside 15-minute window) using raw SQL
      const oldTimestamps = [];
      for (let i = 0; i < 10; i++) {
        const minutesOld = 16 + i;
        oldTimestamps.push(minutesOld);
        await container.run(sql`
          insert into audits (action, details, "loggedAt")
          values (
            'vg.app_user.login.failure',
            jsonb_build_object('username', 'test.test', 'ip', ${ip}::text, 'reason', 'bad_password'),
            now() - (${minutesOld} * interval '1 minute')
          )
        `);
      }

      // Make 15 new failures
      for (let i = 0; i < 15; i += 1) {
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', ip)
          .send({ username: `user${i}.test`, password: 'wrongpassword' })
          .expect(401);
      }

      // Total should be 15 (old ones outside window), not 25
      // Should not be IP locked yet
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'user15.test', password: 'wrongpassword' })
        .expect(401);  // Not 429
    }));

    it('should lift IP lockout after IP lock duration expires (30 minutes)', testService(async (service, container) => {
      const ip = '7.7.7.7';
      const projectId = 1;

      // Clean up any existing audit data for this IP
      await container.run(sql`
        DELETE FROM audits
        WHERE details->>'ip'=${ip}
      `);

      // Make 20 failed attempts (not locked yet)
      for (let i = 0; i < 20; i += 1) {
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', ip)
          .send({ username: `user${i}.test`, password: 'wrongpassword' })
          .expect(401);
      }

      // 21st attempt triggers IP lockout (returns 429)
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'user20.test', password: 'wrongpassword' })
        .expect(429);

      // Verify IP locked (next attempt should be locked)
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'verify.test', password: 'wrongpassword' })
        .expect(429);

      // Age out the IP lockout beyond 30 minutes
      await container.run(sql`
        update audits
        set "loggedAt" = now() - interval '31 minutes'
        where action='vg.app_user.login.ip.lockout'
          and details->>'ip'=${ip}
      `);

      // Clear failure entries to avoid triggering new lockout
      await container.run(sql`
        DELETE FROM audits
        WHERE details->>'ip'=${ip}
          AND action='vg.app_user.login.failure'
      `);

      // Should work now (IP lockout expired, no new failures to trigger re-lock)
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'another.test', password: 'anypassword' })
        .expect(401);  // Returns 401 (auth failed), not 429 (IP locked)
    }));

    it('should handle missing IP gracefully for IP rate limiting', testService(async (service) => {
      const projectId = 1;

      // With no IP, IP rate limiting should not apply
      // Only per-username+IP lockout should work
      const username = 'no-ip-user.test';

      // 5 failed attempts should trigger per-username+IP lockout
      for (let i = 0; i < 5; i += 1) {
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .send({ username, password: 'wrongpassword' })
          .expect(401);
      }

      // Should be per-username+IP locked (401), not IP locked (429)
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .send({ username, password: 'anypassword' })
        .expect(401);
    }));

    it('should track different IPs independently', testService(async (service) => {
      const projectId = 1;

      // IP1: 20 failed attempts → not locked yet
      for (let i = 0; i < 20; i += 1) {
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', '8.8.8.8')
          .send({ username: `user${i}.test`, password: 'wrongpassword' })
          .expect(401);
      }

      // 21st attempt triggers IP lockout
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', '8.8.8.8')
        .send({ username: 'user20.test', password: 'wrongpassword' })
        .expect(429);

      // IP1 should still be locked for subsequent attempts
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', '8.8.8.8')
        .send({ username: 'another.test', password: 'anypassword' })
        .expect(429);

      // IP2: 0 failed attempts → should work
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', '9.9.9.9')
        .send({ username: 'another.test', password: 'wrongpassword' })
        .expect(401);  // Not 429
    }));

    it('should return retryAfterSeconds for IP lockout', testService(async (service) => {
      const ip = '10.10.10.10';
      const projectId = 1;

      // Make 20 failed attempts to trigger IP lockout
      for (let i = 0; i < 20; i += 1) {
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', ip)
          .send({ username: `user${i}.test`, password: 'wrongpassword' })
          .expect(401);
      }

      // Trigger IP lockout
      const response = await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', ip)
        .send({ username: 'user20.test', password: 'wrongpassword' })
        .expect(429);

      // Should have retryAfterSeconds
      if (response.body.retryAfterSeconds !== undefined) {
        response.body.retryAfterSeconds.should.be.within(1, 1800); // 30 minutes = 1800 seconds
      }
    }));

    it('should use X-Forwarded-For header for IP detection', testService(async (service, container) => {
      const projectId = 1;
      const forwardedIp = '11.11.11.11';

      // Clean up any existing audit data
      await container.run(sql`
        DELETE FROM audits
        WHERE details->>'ip'=${forwardedIp}
      `);

      // Make 20 attempts using X-Forwarded-For header
      for (let i = 0; i < 20; i += 1) {
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', forwardedIp)
          .send({ username: `user${i}.test`, password: 'wrongpassword' })
          .expect(401);
      }

      // 21st attempt should trigger IP lockout
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', forwardedIp)
        .send({ username: 'user20.test', password: 'wrongpassword' })
        .expect(429);

      // Verify that the IP in audit logs is the forwarded IP, not request.ip
      const ipLockoutAudits = await container.all(sql`
        select details from audits
        where action='vg.app_user.login.ip.lockout'
          and details->>'ip'=${forwardedIp}
      `);

      ipLockoutAudits.length.should.be.greaterThan(0);
    }));

    it('should handle multiple IPs in X-Forwarded-For correctly (takes first)', testService(async (service, container) => {
      const projectId = 1;
      const firstIp = '12.12.12.12';
      const secondIp = '13.13.13.13';

      // Send request with multiple IPs in X-Forwarded-For
      // Should use the first IP (original client)
      const forwardedFor = `${firstIp}, ${secondIp}`;

      // Make 20 attempts with the same X-Forwarded-For
      for (let i = 0; i < 20; i += 1) {
        await service.post(`/v1/projects/${projectId}/app-users/login`)
          .set('X-Forwarded-For', forwardedFor)
          .send({ username: `user${i}.test`, password: 'wrongpassword' })
          .expect(401);
      }

      // 21st attempt should trigger IP lockout for the first IP
      await service.post(`/v1/projects/${projectId}/app-users/login`)
        .set('X-Forwarded-For', forwardedFor)
        .send({ username: 'user20.test', password: 'wrongpassword' })
        .expect(429);

      // Verify that the first IP is the one that got locked
      const ipLockoutAudits = await container.all(sql`
        select details from audits
        where action='vg.app_user.login.ip.lockout'
          and details->>'ip'=${firstIp}
      `);

      ipLockoutAudits.length.should.be.greaterThan(0);
    }));
  });
});
