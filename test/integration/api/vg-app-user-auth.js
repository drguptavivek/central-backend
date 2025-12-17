const should = require('should');
const { sql } = require('slonik');
require('../assertions');
const { testService } = require('../setup');

const STRONG_PASSWORD = 'GoodPass!1X';

const createAppUser = (service, overrides = {}) => {
  const payload = {
    username: overrides.username,
    password: overrides.password || STRONG_PASSWORD,
    fullName: overrides.fullName || 'VG App User',
    phone: overrides.phone,
    active: overrides.active
  };
  if (!payload.username) payload.username = `vguser-${Math.random().toString(36).slice(2, 8)}`;
  return service.login('alice', (asAlice) =>
    asAlice.post('/v1/projects/1/app-users')
      .send(payload)
      .expect(200)
      .then(({ body }) => body));
};

describe('api: vg app-user auth', () => {
  it('should create app users without long-lived sessions and issue short tokens on login', testService(async (service, container) => {
    const appUser = await createAppUser(service, { username: 'vguser-login' });
    should.not.exist(appUser.token);

    const { count } = await container.one(sql`select count(*) from sessions where "actorId"=${appUser.id}`);
    Number(count).should.equal(0);

    const login = await service.post('/v1/projects/1/app-users/login')
      .send({ username: 'vguser-login', password: STRONG_PASSWORD })
      .expect(200)
      .then((res) => res.body);

    should.exist(login.token);
    login.projectId.should.equal(1);
    login.token.should.be.a.token();
    should.exist(login.expiresAt);

    const { expiresAt, createdAt } = await container.one(sql`
      select "expiresAt", "createdAt" from sessions where token=${login.token}
    `);
    const diffHours = (new Date(expiresAt) - new Date(createdAt)) / (60 * 60 * 1000);
    diffHours.should.be.approximately(72, 0.1);
    new Date(login.expiresAt).getTime().should.be.approximately(new Date(expiresAt).getTime(), 1000);
  }));

  it('should lock out after five failed attempts per username and IP', testService(async (service, container) => {
    const username = 'vguser-lockout';
    await createAppUser(service, { username });

    for (let i = 0; i < 5; i += 1) {
      await service.post('/v1/projects/1/app-users/login')
        .send({ username, password: 'WrongPass!1' })
        .expect(401);
    }

    await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(401);

    const { count, successes } = await container.one(sql`
      select count(*)::int as count,
        sum(case when succeeded then 1 else 0 end)::int as successes
      from vg_app_user_login_attempts
      where username=${username}
    `);
    count.should.equal(5);
    successes.should.equal(0);
  }));

  it('should cap active sessions at three per app user', testService(async (service, container) => {
    const username = 'vguser-cap';
    const appUser = await createAppUser(service, { username });

    const tokens = [];
    for (let i = 0; i < 4; i += 1) {
      const { token } = await service.post('/v1/projects/1/app-users/login')
        .send({ username, password: STRONG_PASSWORD })
        .expect(200)
        .then((res) => res.body);
      tokens.push(token);
    }

    const { count } = await container.one(sql`
      select count(*) from sessions where "actorId"=${appUser.id}
    `);
    Number(count).should.equal(3);

    // Oldest token should be gone.
    await service.post(`/v1/projects/1/app-users/${appUser.id}/revoke`)
      .set('Authorization', `Bearer ${tokens[0]}`)
      .expect(401);
  }));

  it('should respect configured session cap value', testService(async (service, container) => {
    const username = 'vguser-cap-override';
    const appUser = await createAppUser(service, { username });

    await container.run(sql`
      INSERT INTO vg_settings (vg_key_name, vg_key_value)
      VALUES ('vg_app_user_session_cap', '2')
      ON CONFLICT (vg_key_name) DO UPDATE SET vg_key_value='2'
    `);

    const tokens = [];
    for (let i = 0; i < 3; i += 1) {
      const { token } = await service.post('/v1/projects/1/app-users/login')
        .send({ username, password: STRONG_PASSWORD })
        .expect(200)
        .then((res) => res.body);
      tokens.push(token);
    }

    const { count } = await container.one(sql`
      select count(*) from sessions where "actorId"=${appUser.id}
    `);
    Number(count).should.equal(2);

    await service.post(`/v1/projects/1/app-users/${appUser.id}/revoke`)
      .set('Authorization', `Bearer ${tokens[0]}`)
      .expect(401);

    // Reset cap to default for other tests.
    await container.run(sql`
      UPDATE vg_settings SET vg_key_value='3' WHERE vg_key_name='vg_app_user_session_cap'
    `);
  }));

  it('should log audit events for create, login success/failure, password ops, revoke, deactivate', testService(async (service, container) => {
    const username = 'vguser-audit';
    const appUser = await createAppUser(service, { username });

    const latestAuditDetails = async (action, usernameFilter = null) => container.maybeOne(sql`
      select details from audits
      where action=${action}
        ${usernameFilter != null ? sql`and details->>'username'=${usernameFilter}` : sql``}
      order by "loggedAt" desc, id desc
      limit 1
    `).then((opt) => opt.map((row) => row.details).orNull());

    // Create audit
    const createAudit = await latestAuditDetails('vg.app_user.create', username);
    should.exist(createAudit);
    createAudit.username.should.equal(username);

    // Failed login
    await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: 'WrongPass!1' })
      .expect(401);
    const failAudit = await latestAuditDetails('vg.app_user.login.failure', username);
    should.exist(failAudit);
    should.exist(failAudit.username);

    // Successful login
    const { token } = await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(200)
      .then((res) => res.body);
    const successAudit = await latestAuditDetails('vg.app_user.login.success', username);
    should.exist(successAudit);
    should.exist(successAudit.username);

    // Password change
    await service.post(`/v1/projects/1/app-users/${appUser.id}/password/change`)
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: STRONG_PASSWORD, newPassword: 'AnotherGood1!' })
      .expect(200);
    const changeAudit = await latestAuditDetails('vg.app_user.password.change', username);
    should.exist(changeAudit);

    // Reset and deactivate
    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/projects/1/app-users/${appUser.id}/password/reset`)
        .send({ newPassword: STRONG_PASSWORD })
        .expect(200));
    const resetAudit = await latestAuditDetails('vg.app_user.password.reset', username);
    should.exist(resetAudit);

    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/projects/1/app-users/${appUser.id}/active`)
        .send({ active: false })
        .expect(200));
    const deactivateAudit = await latestAuditDetails('vg.app_user.deactivate', username);
    should.exist(deactivateAudit);

    // Revoke (admin-initiated after deactivation to ensure audit is written)
    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/projects/1/app-users/${appUser.id}/revoke-admin`)
        .expect(200));
    const revokeAudit = await latestAuditDetails('vg.app_user.sessions.revoke', username);
    should.exist(revokeAudit);
  }));

  it('should reject a third simultaneous session when DB cap is 2', testService(async (service, container) => {
    const username = 'vguser-cap-2';
    const appUser = await createAppUser(service, { username });

    await container.run(sql`
      INSERT INTO vg_settings (vg_key_name, vg_key_value)
      VALUES ('vg_app_user_session_cap', '2')
      ON CONFLICT (vg_key_name) DO UPDATE SET vg_key_value='2'
    `);

    const tokens = [];
    for (let i = 0; i < 2; i += 1) {
      const { token } = await service.post('/v1/projects/1/app-users/login')
        .send({ username, password: STRONG_PASSWORD })
        .expect(200)
        .then((res) => res.body);
      tokens.push(token);
    }

    const { token: third } = await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(200)
      .then((res) => res.body);

    // Expect oldest token to be trimmed from DB.
    const { count: oldCount } = await container.one(sql`
      select count(*)::int as count from sessions where token=${tokens[0]}
    `);
    oldCount.should.equal(0);

    const { count: remaining } = await container.one(sql`
      select count(*)::int as count from sessions where token in (${sql.join([tokens[1], third].map((t) => sql`${t}`), sql`,` )})
    `);
    remaining.should.equal(2);

    await container.run(sql`
      UPDATE vg_settings SET vg_key_value='3' WHERE vg_key_name='vg_app_user_session_cap'
    `);
  }));

  it('should lift lockout after the lock window expires', testService(async (service, container) => {
    const username = 'vguser-lock-expire';
    await createAppUser(service, { username });

    for (let i = 0; i < 5; i += 1) {
      await service.post('/v1/projects/1/app-users/login')
        .send({ username, password: 'WrongPass!1' })
        .expect(401);
    }

    await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(401);

    // Age out attempts beyond 10 minutes to simulate lock duration expiry.
    await container.run(sql`
      update vg_app_user_login_attempts
        set "createdAt" = now() - interval '11 minutes'
      where username=${username}
    `);

    await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(200);
  }));

  it('should allow password change and invalidate previous sessions', testService(async (service) => {
    const username = 'vguser-change';
    const appUser = await createAppUser(service, { username });

    const { token } = await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(200)
      .then((res) => res.body);

    const newPassword = 'AnotherGood1!';
    await service.post(`/v1/projects/1/app-users/${appUser.id}/password/change`)
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: STRONG_PASSWORD, newPassword })
      .expect(200);

    await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(401);

    const loginAfter = await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: newPassword })
      .expect(200)
      .then((res) => res.body);
    should.exist(loginAfter.token);
    loginAfter.token.should.be.a.token();

    // Old session should no longer authenticate.
    await service.post(`/v1/projects/1/app-users/${appUser.id}/revoke`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  }));

  it('should allow admin reset and deactivation to block login and terminate sessions', testService(async (service, container) => {
    const username = 'vguser-reset';
    const appUser = await createAppUser(service, { username });

    const { token } = await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(200)
      .then((res) => res.body);

    const resetPassword = 'ResetPass!1';
    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/projects/1/app-users/${appUser.id}/password/reset`)
        .send({ newPassword: resetPassword })
        .expect(200));

    await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(401);

    await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: resetPassword })
      .expect(200);

    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/projects/1/app-users/${appUser.id}/active`)
        .send({ active: false })
        .expect(200));

    await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: resetPassword })
      .expect(401);

    const { count } = await container.one(sql`select count(*) from sessions where "actorId"=${appUser.id}`);
    Number(count).should.equal(0);

    await service.post(`/v1/projects/1/app-users/${appUser.id}/revoke-admin`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  }));

  it('should normalize usernames on create and allow login with mixed-case input', testService(async (service, container) => {
    const rawUsername = 'MixedCaseUser ';
    const appUser = await createAppUser(service, { username: rawUsername });

    const { vg_username: storedUsername } = await container.one(sql`
      select vg_username from vg_field_key_auth where "actorId"=${appUser.id}
    `);
    storedUsername.should.equal('mixedcaseuser');

    await service.post('/v1/projects/1/app-users/login')
      .send({ username: ' MIXEDcaseUSER', password: STRONG_PASSWORD })
      .expect(200);
  }));

  it('should reject duplicate usernames', testService(async (service) => {
    const username = 'vguser-duplicate';
    await createAppUser(service, { username });

    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/projects/1/app-users')
        .send({ username, password: STRONG_PASSWORD, fullName: 'Dupe', phone: '+10000000000' })
        .expect(409));
  }));

  it('should reject invalid passwords and blank usernames', testService(async (service) => {
    const badPasswords = [
      'short1!', // too short
      'NoSpecial123', // missing special
      'nouppercase1!', // missing uppercase
      'NOLOWER1!', // missing lowercase
      'NoDigitsHere!' // missing digit
    ];

    for (const pwd of badPasswords) {
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/projects/1/app-users')
          .send({ username: `vguser-${Math.random().toString(36).slice(2, 8)}`, password: pwd, fullName: 'Bad Pass' })
          .expect(400));
    }

    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/projects/1/app-users')
        .send({ username: '   ', password: STRONG_PASSWORD, fullName: 'No Username' })
        .expect(400));

    const confusable1 = 'vguser-confusable';
    const confusable2 = 'vguser-confus\u00adable'; // soft hyphen
    await createAppUser(service, { username: confusable1 });
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/projects/1/app-users')
        .send({ username: confusable2, password: STRONG_PASSWORD, fullName: 'Confusable' })
        .expect(400));
  }));

  it('should reject expired tokens', testService(async (service, container) => {
    const username = 'vguser-expire';
    const appUser = await createAppUser(service, { username });

    const { token } = await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(200)
      .then((res) => res.body);

    await container.run(sql`
      update sessions set "expiresAt" = now() - interval '1 minute' where token=${token}
    `);

    await service.post(`/v1/projects/1/app-users/${appUser.id}/revoke`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  }));

  it('should block login and data submission for deactivated app users', testService(async (service, container) => {
    const username = 'vguser-deactivated';
    const appUser = await createAppUser(service, { username });

    const { token } = await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(200)
      .then((res) => res.body);

    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/projects/1/app-users/${appUser.id}/active`)
        .send({ active: false })
        .expect(200));

    await service.post('/v1/projects/1/app-users/login')
      .send({ username, password: STRONG_PASSWORD })
      .expect(401);

    // Attempt to use old token on an auth-required route should also fail.
    await service.post(`/v1/projects/1/app-users/${appUser.id}/revoke`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  }));

  it('should forbid an app user from changing, resetting, or deactivating another app user', testService(async (service) => {
    const userA = await createAppUser(service, { username: 'vguser-a' });
    const userB = await createAppUser(service, { username: 'vguser-b' });

    const { token: tokenA } = await service.post('/v1/projects/1/app-users/login')
      .send({ username: 'vguser-a', password: STRONG_PASSWORD })
      .expect(200)
      .then((res) => res.body);

    await service.post(`/v1/projects/1/app-users/${userB.id}/password/change`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ oldPassword: STRONG_PASSWORD, newPassword: 'OtherGood1!' })
      .expect(403);

    await service.post(`/v1/projects/1/app-users/${userB.id}/password/reset`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ newPassword: 'ResetOther!1' })
      .expect(403);

    await service.post(`/v1/projects/1/app-users/${userB.id}/active`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ active: false })
      .expect(403);
  }));

  it('should forbid an app user from changing an admin/user password via user routes', testService(async (service, container) => {
    const appUser = await createAppUser(service, { username: 'vguser-noadmin' });
    const { token } = await service.post('/v1/projects/1/app-users/login')
      .send({ username: 'vguser-noadmin', password: STRONG_PASSWORD })
      .expect(200)
      .then((res) => res.body);

    const { id: aliceActorId } = await container.one(sql`select id from actors where "displayName"='Alice' limit 1`);

    await service.put(`/v1/users/${aliceActorId}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({ old: 'irrelevant', new: 'NewAdminPass!1' })
      .expect(403);
  }));
});
