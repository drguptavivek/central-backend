const should = require('should');
const { sql } = require('slonik');
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

    login.projectId.should.equal(1);
    login.token.should.be.a.token();

    const { expiresAt, createdAt } = await container.one(sql`
      select "expiresAt", "createdAt" from sessions where token=${login.token}
    `);
    const diffHours = (new Date(expiresAt) - new Date(createdAt)) / (60 * 60 * 1000);
    diffHours.should.be.approximately(72, 0.1);
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
});
