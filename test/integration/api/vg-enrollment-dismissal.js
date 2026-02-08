const should = require('should');
const { sql } = require('slonik');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg enrollment dismissal', () => {
  it('should allow non-mandatory user to dismiss prompt permanently', testService(async (service, container) => {
    // Create viewer
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users')
        .send({ email: 'viewer_dismiss@getodk.org', password: 'Password123!' })
        .expect(200)
    );

    const viewer = await container.Users.getByEmail('viewer_dismiss@getodk.org');
    const actorId = viewer.get().actor.id;

    // Login as viewer to get token
    const { body: session } = await service.post('/v1/sessions')
      .send({ email: 'viewer_dismiss@getodk.org', password: 'Password123!' })
      .expect(200);

    // Dismiss prompt using token
    await service.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
      .set('Authorization', `Bearer ${session.token}`)
      .send({ remindAfterDays: null })
      .expect(200);

    // Verify record
    const record = await container.one(sql`
      SELECT totp_prompt_dismissed_at, totp_prompt_remind_after
      FROM vg_web_user_totp
      WHERE "actorId" = ${actorId}
    `);

    should.exist(record.totp_prompt_dismissed_at);
    should.not.exist(record.totp_prompt_remind_after);
  }));

  it('should allow non-mandatory user to dismiss prompt with reminder', testService(async (service, container) => {
    // Create viewer
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users')
        .send({ email: 'viewer_remind@getodk.org', password: 'Password123!' })
        .expect(200)
    );

    const viewer = await container.Users.getByEmail('viewer_remind@getodk.org');
    const actorId = viewer.get().actor.id;

    // Login as viewer to get token
    const { body: session } = await service.post('/v1/sessions')
      .send({ email: 'viewer_remind@getodk.org', password: 'Password123!' })
      .expect(200);

    // Dismiss prompt using token
    await service.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
      .set('Authorization', `Bearer ${session.token}`)
      .send({ remindAfterDays: 7 })
      .expect(200);

    // Verify record
    const record = await container.one(sql`
      SELECT totp_prompt_dismissed_at, totp_prompt_remind_after
      FROM vg_web_user_totp
      WHERE "actorId" = ${actorId}
    `);

    should.not.exist(record.totp_prompt_dismissed_at);
    should.exist(record.totp_prompt_remind_after);
  }));

  it('should reject dismissal for mandatory user (admin)', testService(async (service, container) => {
    const alice = await container.Users.getByEmail('alice@getodk.org');
    const actorId = alice.get().actor.id;

    // Login as alice (admin is mandatory by default)
    const { body: session } = await service.post('/v1/sessions')
      .send({ email: 'alice@getodk.org', password: 'password4alice' })
      .expect(200);

    // Try to dismiss
    await service.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
      .set('Authorization', `Bearer ${session.token}`)
      .send({ remindAfterDays: null })
      .expect(403);
  }));

  it('should reject invalid remindAfterDays value', testService(async (service, container) => {
    // Create viewer
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users')
        .send({ email: 'viewer_invalid@getodk.org', password: 'Password123!' })
        .expect(200)
    );

    const viewer = await container.Users.getByEmail('viewer_invalid@getodk.org');
    const actorId = viewer.get().actor.id;

    // Login as viewer
    const { body: session } = await service.post('/v1/sessions')
      .send({ email: 'viewer_invalid@getodk.org', password: 'Password123!' })
      .expect(200);

    // Try to dismiss with invalid value
    await service.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
      .set('Authorization', `Bearer ${session.token}`)
      .send({ remindAfterDays: 400 }) // > 365
      .expect(400);
  }));

  it('should allow admin to dismiss for another non-mandatory user', testService(async (service, container) => {
    // Create viewer
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users')
        .send({ email: 'viewer_admin_dismiss@getodk.org', password: 'Password123!' })
        .expect(200)
    );

    const viewer = await container.Users.getByEmail('viewer_admin_dismiss@getodk.org');
    const actorId = viewer.get().actor.id;

    // Login as admin (Alice)
    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
        .send({ remindAfterDays: null })
        .expect(200)
    );

    // Verify record
    const record = await container.one(sql`
      SELECT totp_prompt_dismissed_at
      FROM vg_web_user_totp
      WHERE "actorId" = ${actorId}
    `);

    should.exist(record.totp_prompt_dismissed_at);
  }));
});
