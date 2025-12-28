const should = require('should');
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

const loginAppUser = (service, username) =>
  service.post('/v1/projects/1/app-users/login')
    .send({ username, password: STRONG_PASSWORD, deviceId: 'device-1' })
    .expect(200)
    .then((res) => res.body);

const makeTelemetryPayload = (overrides = {}) => ({
  deviceId: overrides.deviceId || 'device-1',
  collectVersion: overrides.collectVersion || 'Collect/2025.1',
  deviceDateTime: overrides.deviceDateTime || new Date().toISOString(),
  location: overrides.location || {
    latitude: 37.7749,
    longitude: -122.4194,
    altitude: 10.5,
    accuracy: 3.2,
    speed: 0.5,
    bearing: 42.1,
    provider: 'gps'
  }
});

describe('api: vg telemetry', () => {
  it('should accept app-user telemetry and allow admin listing with filters and paging', testService(async (service) => {
    const username = 'vguser-telemetry';
    const appUser = await createAppUser(service, { username });
    const login = await loginAppUser(service, username);

    const firstPayload = makeTelemetryPayload({ deviceId: 'device-1' });
    const first = await service.post('/v1/projects/1/app-users/telemetry')
      .set('Authorization', `Bearer ${login.token}`)
      .send(firstPayload)
      .expect(200)
      .then(({ body }) => body);

    should.exist(first.id);
    should.exist(first.dateTime);
    should.exist(first.serverTime);

    const secondPayload = makeTelemetryPayload({ deviceId: 'device-2' });
    await service.post('/v1/projects/1/app-users/telemetry')
      .set('Authorization', `Bearer ${login.token}`)
      .send(secondPayload)
      .expect(200);

    const dateFrom = new Date(Date.now() - 60 * 1000).toISOString();
    const dateTo = new Date(Date.now() + 60 * 1000).toISOString();

    const filtered = await service.login('alice', (asAlice) =>
      asAlice.get('/v1/system/app-users/telemetry')
        .query({ projectId: 1, deviceId: 'device-1', appUserId: appUser.id, dateFrom, dateTo })
        .expect(200)
        .then(({ body }) => body));

    filtered.should.be.an.Array();
    filtered.length.should.equal(1);
    filtered[0].deviceId.should.equal('device-1');
    filtered[0].collectVersion.should.equal(firstPayload.collectVersion);
    filtered[0].appUserId.should.equal(appUser.id);
    filtered[0].projectId.should.equal(1);
    filtered[0].deviceDateTime.should.equal(firstPayload.deviceDateTime);
    filtered[0].location.should.eql(firstPayload.location);

    const newest = await service.login('alice', (asAlice) =>
      asAlice.get('/v1/system/app-users/telemetry')
        .query({ projectId: 1, appUserId: appUser.id, limit: 1, offset: 0 })
        .expect(200)
        .then(({ body }) => body));

    newest.length.should.equal(1);
    newest[0].deviceId.should.equal('device-2');

    const older = await service.login('alice', (asAlice) =>
      asAlice.get('/v1/system/app-users/telemetry')
        .query({ projectId: 1, appUserId: appUser.id, limit: 1, offset: 1 })
        .expect(200)
        .then(({ body }) => body));

    older.length.should.equal(1);
    older[0].deviceId.should.equal('device-1');
  }));

  it('should reject non-UTC deviceDateTime', testService(async (service) => {
    const username = 'vguser-telemetry-utc';
    await createAppUser(service, { username });
    const login = await loginAppUser(service, username);

    const payload = makeTelemetryPayload({ deviceDateTime: '2025-12-21T10:00:00+05:30' });

    await service.post('/v1/projects/1/app-users/telemetry')
      .set('Authorization', `Bearer ${login.token}`)
      .send(payload)
      .expect(400);
  }));

  it('should reject telemetry from non-app-user actors', testService(async (service) => {
    const payload = makeTelemetryPayload();

    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/projects/1/app-users/telemetry')
        .send(payload)
        .expect(403));
  }));
});
