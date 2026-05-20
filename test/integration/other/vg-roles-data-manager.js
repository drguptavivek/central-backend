const { testService } = require('../setup');
const testData = require('../../data/xml');

const STRONG_PASSWORD = 'GoodPass!1X';

const dataManager = (f) => async (service) => {
  const asManager = await service.login('chelsea');
  const { body: chelsea } = await asManager.get('/v1/users/current').expect(200);
  const asAlice = await service.login('alice');
  await asAlice.post(`/v1/projects/1/assignments/data_mgr/${chelsea.id}`).expect(200);
  return f(asManager, chelsea, service);
};

const withSubmission = (f) => async (service) => {
  const asAlice = await service.login('alice');
  await asAlice.post('/v1/projects/1/forms/simple/submissions')
    .send(testData.instances.simple.one)
    .set('Content-Type', 'application/xml')
    .expect(200);
  return f(service);
};

const createAppUser = (asUser, username = 'dm-app-user') =>
  asUser.post('/v1/projects/1/app-users')
    .send({
      username,
      password: STRONG_PASSWORD,
      fullName: 'DM App User',
      phone: '555-0100'
    })
    .expect(200)
    .then(({ body }) => body);

describe('data manager role', () => {
  it('can manage app users and login history', testService(dataManager(async (asManager) => {
    const appUser = await createAppUser(asManager);

    await asManager.get('/v1/projects/1/app-users')
      .expect(200)
      .then(({ body }) => {
        body.map((fk) => fk.id).should.containEql(appUser.id);
      });

    await asManager.patch(`/v1/projects/1/app-users/${appUser.id}`)
      .send({ displayName: 'Updated DM App User', phone: '555-0101' })
      .expect(200)
      .then(({ body }) => {
        body.displayName.should.equal('Updated DM App User');
        body.phone.should.equal('555-0101');
      });

    await asManager.post(`/v1/projects/1/app-users/${appUser.id}/password/reset`)
      .send({ newPassword: 'NewGoodPass!1' })
      .expect(200);

    await asManager.get('/v1/projects/1/app-users/sessions')
      .expect(200);

    await asManager.post(`/v1/projects/1/app-users/${appUser.id}/revoke-admin`)
      .expect(200);
  })));

  it('can update app-user form access and form state through the narrow endpoint', testService(dataManager(async (asManager) => {
    const appUser = await createAppUser(asManager, 'dm-form-access');
    const { body: roles } = await asManager.get('/v1/roles').expect(200);
    const appUserRole = roles.find((role) => role.system === 'app-user');

    await asManager.put('/v1/projects/1/form-access')
      .send({
        forms: [
          {
            xmlFormId: 'simple',
            state: 'closing',
            assignments: [{ actorId: appUser.id, roleId: appUserRole.id }]
          },
          {
            xmlFormId: 'withrepeat',
            state: 'open',
            assignments: []
          }
        ]
      })
      .expect(200);

    await asManager.get('/v1/projects/1/forms/simple')
      .expect(200)
      .then(({ body }) => { body.state.should.equal('closing'); });

    await asManager.get('/v1/projects/1/forms/simple/assignments/app-user')
      .expect(200)
      .then(({ body }) => {
        body.map((actor) => actor.id).should.containEql(appUser.id);
      });
  })));

  it('can list, review, delete, and restore submissions', testService(withSubmission(dataManager(async (asManager) => {
    await asManager.get('/v1/projects/1/forms/simple/submissions')
      .expect(200)
      .then(({ body }) => {
        body.length.should.equal(1);
        body[0].instanceId.should.equal('one');
      });

    await asManager.get('/v1/projects/1/forms/simple/submissions/one')
      .expect(200)
      .then(({ body }) => {
        body.should.be.a.Submission();
        body.instanceId.should.equal('one');
      });

    await asManager.patch('/v1/projects/1/forms/simple/submissions/one')
      .send({ reviewState: 'approved' })
      .expect(200)
      .then(({ body }) => { body.reviewState.should.equal('approved'); });

    await asManager.delete('/v1/projects/1/forms/simple/submissions/one')
      .expect(200);

    await asManager.post('/v1/projects/1/forms/simple/submissions/one/restore')
      .expect(200);
  }))));

  it('can view project telemetry without sitewide config access', testService(dataManager(async (asManager, _, service) => {
    const asAlice = await service.login('alice');
    const appUser = await createAppUser(asAlice, 'dm-telemetry');
    const login = await service.post('/v1/projects/1/app-users/login')
      .send({ username: 'dm-telemetry', password: STRONG_PASSWORD, deviceId: 'device-dm' })
      .expect(200)
      .then(({ body }) => body);

    await service.post('/v1/projects/1/app-users/telemetry')
      .set('Authorization', `Bearer ${login.token}`)
      .send({
        deviceId: 'device-dm',
        collectVersion: 'Collect/2026.1',
        deviceDateTime: new Date().toISOString(),
        location: { latitude: 12.34, longitude: 56.78 }
      })
      .expect(200);

    await asManager.get('/v1/projects/1/app-users/telemetry')
      .query({ appUserId: appUser.id, deviceId: 'device-dm' })
      .expect(200)
      .then(({ body }) => {
        body.length.should.equal(1);
        body[0].appUserId.should.equal(appUser.id);
        body[0].projectId.should.equal(1);
      });

    await asManager.get('/v1/system/app-users/telemetry')
      .query({ projectId: 1 })
      .expect(403);
  })));

  it('cannot export, connect data, manage entities, or perform broad project/form admin', testService(withSubmission(dataManager(async (asManager) => {
    await asManager.get('/v1/projects/1/forms/simple/submissions.csv.zip')
      .expect(403);
    await asManager.get('/v1/projects/1/forms/simple/submissions.csv')
      .expect(403);
    await asManager.get('/v1/projects/1/forms/simple.svc')
      .expect(403);
    await asManager.get('/v1/projects/1/forms/simple.svc/Submissions')
      .expect(403);

    await asManager.patch('/v1/projects/1')
      .send({ name: 'Nope' })
      .expect(403);
    await asManager.post('/v1/projects/1/forms')
      .send(testData.forms.withAttachments)
      .set('Content-Type', 'text/xml')
      .expect(403);
    await asManager.patch('/v1/projects/1/forms/simple')
      .send({ name: 'Nope' })
      .expect(403);
    await asManager.get('/v1/projects/1/datasets')
      .expect(403);
  }))));
});
