const should = require('should');
const { sql } = require('slonik');
const { testService } = require('../setup');

describe('api: /sessions (vg web users)', () => {
  if (process.env.TEST_AUTH === 'oidc') return;

  it('should audit failed login attempts with normalized identifiers', testService(async (service, container) => {
    await service.post('/v1/sessions')
      .send({ email: 'ChElSeA@GetOdk.Org', password: 'wrong-password' })
      .set('User-Agent', 'central/tests')
      .expect(401);

    const audit = await container.one(sql`
      select details from audits
      where action='user.session.create.failure'
      order by "loggedAt" desc, id desc
      limit 1
    `);

    audit.details.email.should.equal('chelsea@getodk.org');
    audit.details.userAgent.should.equal('central/tests');
    should.exist(audit.details.ip);
  }));

  it('should lock out logins after repeated failures', testService(async (service, container) => {
    for (let i = 0; i < 5; i += 1) {
      await service.post('/v1/sessions')
        .send({ email: 'chelsea@getodk.org', password: 'wrong-password' })
        .expect(401);
    }

    await service.post('/v1/sessions')
      .send({ email: 'chelsea@getodk.org', password: 'password4chelsea' })
      .expect(401);

    const lockout = await container.one(sql`
      select details from audits
      where action='user.session.lockout'
        and details->>'email'='chelsea@getodk.org'
      order by "loggedAt" desc, id desc
      limit 1
    `);

    lockout.details.durationMinutes.should.equal(10);
  }));

  it('should normalize response timing between missing email and bad password', testService(async (service) => {
    const invalidEmailPromise = service.post('/v1/sessions')
      .send({ email: 'missing-user@example.com', password: 'wrong-password' });
    const invalidPasswordPromise = service.post('/v1/sessions')
      .send({ email: 'chelsea@getodk.org', password: 'wrong-password' });

    const [invalidEmail, invalidPassword] = await Promise.all([
      invalidEmailPromise.then((res) => res).catch((res) => res),
      invalidPasswordPromise.then((res) => res).catch((res) => res)
    ]);

    invalidEmail.status.should.equal(401);
    invalidPassword.status.should.equal(401);
  }));
});
