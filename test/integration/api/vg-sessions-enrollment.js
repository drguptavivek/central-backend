const should = require('should');
const { sql } = require('slonik');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg sessions enrollment prompt', () => {
  it('should return requireTotpSetup:true and mandatory:true for admin without TOTP', testService(async (service, container) => {
    // Admin is mandatory by default in test settings
    const login = await service.post('/v1/sessions')
      .send({ email: 'alice@getodk.org', password: 'password4alice' })
      .expect(200)
      .then(({ body }) => body);

    login.requireTotpSetup.should.be.true();
    login.mandatory.should.be.true();
    should.exist(login.token);
  }));

  it('should NOT set cookies for mandatory user without TOTP', testService(async (service) => {
    const res = await service.post('/v1/sessions')
      .send({ email: 'alice@getodk.org', password: 'password4alice' })
      .expect(200);

    const cookies = res.headers['set-cookie'] || [];
    cookies.some(c => c.includes('session=')).should.be.false();
  }));

  it('should return shouldPromptTotpEnrollment:true for non-mandatory user (viewer)', testService(async (service, container) => {
    // Create a viewer user
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users')
        .send({ email: 'viewer@getodk.org', password: 'Password123!' })
        .expect(200)
    );

    const login = await service.post('/v1/sessions')
      .send({ email: 'viewer@getodk.org', password: 'Password123!' })
      .expect(200)
      .then(({ body }) => body);

    login.shouldPromptTotpEnrollment.should.be.true();
    should.not.exist(login.requireTotpSetup);
  }));

  it('should set cookies for non-mandatory user', testService(async (service) => {
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users')
        .send({ email: 'viewer_cookie@getodk.org', password: 'Password123!' })
        .expect(200)
    );

    const res = await service.post('/v1/sessions')
      .send({ email: 'viewer_cookie@getodk.org', password: 'Password123!' })
      .expect(200);

    const cookies = res.headers['set-cookie'] || [];
    cookies.some(c => c.includes('session=')).should.be.true();
  }));

  it('should NOT return shouldPromptTotpEnrollment if already dismissed', testService(async (service, container) => {
    // Create viewer
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users')
        .send({ email: 'viewer2@getodk.org', password: 'Password123!' })
        .expect(200)
    );

    const viewer = await container.Users.getByEmail('viewer2@getodk.org');
    const actorId = viewer.get().actor.id;

    // Dismiss prompt
    await container.VgWebUserTotp.dismissEnrollmentPrompt(actorId, null);

    const login = await service.post('/v1/sessions')
      .send({ email: 'viewer2@getodk.org', password: 'Password123!' })
      .expect(200)
      .then(({ body }) => body);

    login.shouldPromptTotpEnrollment.should.be.false();
  }));

  it('should return shouldPromptTotpEnrollment if remind-after date has passed', testService(async (service, container) => {
    // Create viewer
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users')
        .send({ email: 'viewer3@getodk.org', password: 'Password123!' })
        .expect(200)
    );

    const viewer = await container.Users.getByEmail('viewer3@getodk.org');
    const actorId = viewer.get().actor.id;

    // Set remind-after in the past
    const pastDate = new Date(Date.now() - 1000);
    await container.run(sql`
      INSERT INTO vg_web_user_totp ("actorId", totp_prompt_remind_after, created_at, updated_at)
      VALUES (${actorId}, ${pastDate.toISOString()}, now(), now())
      ON CONFLICT ("actorId") DO UPDATE SET totp_prompt_remind_after = ${pastDate.toISOString()}
    `);

    const login = await service.post('/v1/sessions')
      .send({ email: 'viewer3@getodk.org', password: 'Password123!' })
      .expect(200)
      .then(({ body }) => body);

    login.shouldPromptTotpEnrollment.should.be.true();
  }));
});
