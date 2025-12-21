// VG-specific adaptations of legacy app-user tests for the short-lived token flow.
const should = require('should');
const { testService, withClosedForm } = require('../setup');
const { sql } = require('slonik');
require('../assertions');
const testData = require('../../data/xml');
const { FieldKey } = require('../../../lib/model/frames');

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

  it('denies creation to users without project manage rights', testService(async (service) => {
    const asChelsea = await service.login('chelsea');
    await asChelsea.post('/v1/projects/1/app-users')
      .send({ username: uniqueUsername(), password: STRONG_PASSWORD, fullName: 'Nope' })
      .expect(403);
  }));

  it('allows project managers to create app users', testService(async (service) => {
    const asBob = await service.login('bob'); // project manager on project 1
    await asBob.post('/v1/projects/1/app-users')
      .send({ username: uniqueUsername(), password: STRONG_PASSWORD, fullName: 'PM User' })
      .expect(200);
  }));

  it('lists created app users without long-lived tokens', testService(async (service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const list = await asAlice.get('/v1/projects/1/app-users').expect(200).then(({ body }) => body);
    list.find((u) => u.id === appUser.id).should.match({ token: null });
  }));

  it('orders listings by most recently created', testService(async (service) => {
    const asAlice = await service.login('alice');
    await createAppUser(service, asAlice, 1, { fullName: 'first' });
    await createAppUser(service, asAlice, 1, { fullName: 'second' });
    await createAppUser(service, asAlice, 1, { fullName: 'third' });
    const list = await asAlice.get('/v1/projects/1/app-users').expect(200).then(({ body }) => body);
    list.slice(0, 3).map((u) => u.displayName).should.eql(['third', 'second', 'first']);
  }));

  it('lists only app users from the requested project', testService(async (service) => {
    const asAlice = await service.login('alice');
    const { id: project2 } = await asAlice.post('/v1/projects').send({ name: 'project-2' }).expect(200).then(({ body }) => body);
    await createAppUser(service, asAlice, 1, { fullName: 'p1-a' });
    await createAppUser(service, asAlice, 1, { fullName: 'p1-b' });
    await createAppUser(service, asAlice, project2, { fullName: 'p2-a' });
    const list = await asAlice.get('/v1/projects/1/app-users').expect(200).then(({ body }) => body);
    list.map((u) => u.displayName).should.eql(['p1-b', 'p1-a']);
  }));

  it('omits session tokens from listings even after login', testService(async (service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const token = await loginAppUser(service, appUser);
    should.exist(token);
    const list = await asAlice.get('/v1/projects/1/app-users').expect(200).then(({ body }) => body);
    const entry = list.find((u) => u.id === appUser.id);
    should.exist(entry);
    should(entry.token).equal(null);
  }));

  it('denies listing to users without project manage rights', testService(async (service) => {
    const asChelsea = await service.login('chelsea');
    await asChelsea.get('/v1/projects/1/app-users').expect(403);
  }));

  it('returns extended metadata with lastUsed for active app users', testService(async (service) => {
    const asAlice = await service.login('alice');
    const usedUser = await createAppUser(service, asAlice);
    const unusedUser = await createAppUser(service, asAlice, 1, { username: uniqueUsername() });
    const usedToken = await loginAppUser(service, usedUser);
    await asAlice.post(`/v1/projects/1/forms/simple/assignments/app-user/${usedUser.id}`).expect(200);
    await service.post(`/v1/key/${usedToken}/projects/1/forms/simple/submissions`)
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(200);
    const list = await asAlice.get('/v1/projects/1/app-users')
      .set('X-Extended-Metadata', 'true')
      .expect(200)
      .then(({ body }) => body);
    const used = list.find((u) => u.id === usedUser.id);
    const unused = list.find((u) => u.id === unusedUser.id);
    should.exist(used.lastUsed);
    used.lastUsed.should.be.a.recentIsoDate();
    should(unused.lastUsed).equal(null);
    used.createdBy.displayName.should.equal('Alice');
    used.projectId.should.equal(1);
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

  it('rejects submissions after admin revoke', testService(async (service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const token = await loginAppUser(service, appUser);
    await asAlice.post(`/v1/projects/1/forms/simple/assignments/app-user/${appUser.id}`).expect(200);
    await asAlice.post(`/v1/projects/1/app-users/${appUser.id}/revoke-admin`).expect(200);
    await service.post(`/v1/key/${token}/projects/1/forms/simple/submissions`)
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(403);
  }));

  it('rejects submissions when app user is deactivated', testService(async (service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const token = await loginAppUser(service, appUser);
    await asAlice.post(`/v1/projects/1/forms/simple/assignments/app-user/${appUser.id}`).expect(200);
    await asAlice.post(`/v1/projects/1/app-users/${appUser.id}/active`).send({ active: false }).expect(200);
    await service.post(`/v1/key/${token}/projects/1/forms/simple/submissions`)
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(403);
  }));

  it('rejects submissions using a token from another project', testService(async (service) => {
    const asAlice = await service.login('alice');
    const { id: project2 } = await asAlice.post('/v1/projects').send({ name: 'Second Project' }).expect(200).then(({ body }) => body);
    const appUser = await createAppUser(service, asAlice, project2);
    const token = await loginAppUser(service, appUser);
    await service.post(`/v1/key/${token}/projects/1/forms/simple/submissions`)
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(403);
  }));

  it('rejects submissions using an expired token', testService(async (service, container) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const token = await loginAppUser(service, appUser);
    await asAlice.post(`/v1/projects/1/forms/simple/assignments/app-user/${appUser.id}`).expect(200);
    await container.run(sql`update sessions set "expiresAt" = now() - interval '1 hour' where token=${token}`);
    await service.post(`/v1/key/${token}/projects/1/forms/simple/submissions`)
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(403);
  }));

  it('rejects submissions with malformed/unknown tokens', testService(async (service) => {
    await service.post('/v1/key/not-a-token/projects/1/forms/simple/submissions')
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(401);
  }));

  it('rejects legacy long-lived app-user sessions without vg auth', testService(async (service, container) => {
    const asAlice = await service.login('alice');
    const { id: actorId } = await container.one(sql`select id from actors where "displayName"='Alice' limit 1`);
    const project = await container.Projects.getById(1);

    const fk = await container.FieldKeys.create(
      FieldKey.fromApi({ displayName: 'legacy-app-user' }).with({ createdBy: actorId }),
      project
    );

    await asAlice.post(`/v1/projects/1/forms/simple/assignments/app-user/${fk.actor.id}`).expect(200);

    await service.post(`/v1/key/${fk.aux.session.token}/projects/1/forms/simple/submissions`)
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(401);
  }));

  it('rejects submissions after password change using old token', testService(async (service, container) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const token = await loginAppUser(service, appUser);
    await asAlice.post(`/v1/projects/1/forms/simple/assignments/app-user/${appUser.id}`).expect(200);
    // Change password via self route using current token to invalidate sessions.
    await service.post(`/v1/projects/1/app-users/${appUser.id}/password/change`)
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: STRONG_PASSWORD, newPassword: 'NewPass!2Y' })
      .expect(200);
    await service.post(`/v1/key/${token}/projects/1/forms/simple/submissions`)
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(403);
    // New token should work.
    const newToken = await loginAppUser(service, { username: appUser.username, password: 'NewPass!2Y' });
    await service.post(`/v1/key/${newToken}/projects/1/forms/simple/submissions`)
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(200);
  }));

  it('rejects submissions for unassigned forms', testService(async (service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const token = await loginAppUser(service, appUser);
    // No assignment performed
    await service.post(`/v1/key/${token}/projects/1/forms/simple/submissions`)
      .send(testData.instances.simple.one)
      .set('Content-Type', 'application/xml')
      .expect(403);
  }));

  it('deletes app users assignments on delete and scopes deletion to project', testService(async (service) => {
    const asAlice = await service.login('alice');
    const fk = await createAppUser(service, asAlice);
    await asAlice.post(`/v1/projects/1/forms/simple/assignments/app-user/${fk.id}`).expect(200);
    await asAlice.delete(`/v1/projects/1/app-users/${fk.id}`).expect(200);
    await asAlice.get('/v1/projects/1/forms/simple/assignments').expect(200).then(({ body }) => body.should.eql([]));
    const { id: project2 } = await asAlice.post('/v1/projects').send({ name: 'proj-2' }).expect(200).then(({ body }) => body);
    const fk2 = await createAppUser(service, asAlice, project2);
    await asAlice.delete(`/v1/projects/1/app-users/${fk2.id}`).expect(404);
  }));

  it('allows project managers to delete app users in their project', testService(async (service) => {
    const asBob = await service.login('bob');
    const fk = await createAppUser(service, asBob);
    await asBob.delete(`/v1/projects/1/app-users/${fk.id}`).expect(200);
    const asAlice = await service.login('alice');
    const list = await asAlice.get('/v1/projects/1/app-users').expect(200).then(({ body }) => body);
    should(list.find((u) => u.id === fk.id)).equal(undefined);
  }));

  it('app user tokens cannot access user profile routes', testService(async (service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(service, asAlice);
    const token = await loginAppUser(service, appUser);
    await service.get('/v1/users/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  }));
});
