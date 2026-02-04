const should = require('should');
const { sql } = require('slonik');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg user reset initiate rate limiting', () => {
  describe('POST /v1/users/reset/initiate', () => {
    if (process.env.TEST_AUTH === 'oidc') return;

    const cleanup = (container) => container.run(sql`
      DELETE FROM audits
      WHERE action in ('user.reset.initiate', 'user.reset.ip.lockout', 'user.reset.email.lockout')
    `);

    it('should lock out IP after 3 attempts within window (4th returns 429)', testService(async (service, container) => {
      const ip = '10.0.0.10';
      const emailBase = 'reset-ip';
      const email = 'reset-ip@test.com';
      await cleanup(container);

      for (let i = 0; i < 3; i += 1) {
        await service.post('/v1/users/reset/initiate')
          .set('X-Forwarded-For', ip)
          .send({ email: `${emailBase}${i}@test.com` })
          .expect(200);
      }

      const response = await service.post('/v1/users/reset/initiate')
        .set('X-Forwarded-For', ip)
        .send({ email })
        .expect(429);

      if (response.body.code !== undefined) {
        response.body.code.should.equal(429.8);
      }
    }));

    it('should lock out email after 3 attempts within window (4th returns 429)', testService(async (service, container) => {
      const ip = '10.0.0.11';
      const emailBase = 'reset-email';
      const email = 'reset-email@test.com';
      await cleanup(container);

      for (let i = 0; i < 3; i += 1) {
        await service.post('/v1/users/reset/initiate')
          .set('X-Forwarded-For', ip)
          .send({ email })
          .expect(200);
      }

      const response = await service.post('/v1/users/reset/initiate')
        .set('X-Forwarded-For', ip)
        .send({ email })
        .expect(429);

      if (response.body.code !== undefined) {
        response.body.code.should.equal(429.8);
      }
    }));

    it('should return 200 for unknown email when below thresholds', testService(async (service, container) => {
      const ip = '10.0.0.12';
      const email = 'unknown-reset@test.com';
      await cleanup(container);

      await service.post('/v1/users/reset/initiate')
        .set('X-Forwarded-For', ip)
        .send({ email })
        .expect(200);
    }));
  });
});
