// VG-specific adaptations of legacy app-user tests for the short-lived token flow.
const should = require('should');
const { testService, withClosedForm } = require('../setup');
require('../assertions');
const testData = require('../../data/xml');

const STRONG_PASSWORD = 'GoodPass!1X';
const uniqueUsername = () => `vg-legacy-${Math.random().toString(36).slice(2, 8)}`;

const createAppUser = (service, asUser, projectId = 1, overrides = {}) => {
  const username = overrides.username || uniqueUsername();
  const payload = {
    username,
    password: overrides.password || STRONG_PASSWORD,
    fullName: overrides.fullName || 'Legacy VG App User',
    phone: overrides.phone,
    active: overrides.active
  };
  return asUser.post(`/v1/projects/${projectId}/app-users`)
    .send(payload)
    .expect(overrides.expectStatus || 200)
    .then(({ body }) => ({ ...body, username, password: payload.password, projectId }));
};

const loginAppUser = (service, { username, password, projectId = 1 }) =>
  service.post(`/v1/projects/${projectId}/app-users/login`)
    .send({ username, password })
    .expect(200)
    .then(({ body }) => body.token);

describe('vg org app-users (short token flow)', () => {
  it('allows admin to create and login an app user (short-lived token)', testService(async (service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    should(appUser.token).be.undefined();
    const token = await loginAppUser(service, appUser);
    should.exist(token);
    token.should.be.a.String();
  }));

  it('lists created app users without long-lived tokens', testService(async (service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const list = await asAlice.get('/v1/projects/1/app-users').expect(200).then(({ body }) => body);
    list.find((u) => u.id === appUser.id).should.match({ token: null });
  }));

  it('supports self login and submission via /key/:token', testService(async (service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const token = await loginAppUser(service, appUser);
    await asAlice.post(`/v1/projects/1/forms/simple/assignments/app-user/${appUser.id}`).expect(200);
    await service.post(`/v1/key/${token}/projects/1/forms/simple/submissions`)
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(200);
  }));

  it('denies closed form access via /key/:token', testService(withClosedForm(async (service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const token = await loginAppUser(service, appUser);
    await asAlice.post(`/v1/projects/1/forms/withAttachments/assignments/app-user/${appUser.id}`).expect(200);
    await service.get(`/v1/key/${token}/projects/1/forms/withAttachments`).expect(403);
  })));
});
