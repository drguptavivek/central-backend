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
  appUserId: overrides.appUserId,
  event: overrides.event,
  events: overrides.events,
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
    first.appUserId.should.equal(appUser.id);
    first.deviceId.should.equal(firstPayload.deviceId);
    should.exist(first.dateTime);
    should.exist(first.serverTime);
    first.status.should.equal('ok');

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
        .expect(401));
  }));

  it('should accept a batch of events (max 10) and write one row per event', testService(async (service) => {
    const username = `vguser-telemetry-batch-${Math.random().toString(36).slice(2, 8)}`;
    const appUser = await createAppUser(service, { username });
    const login = await loginAppUser(service, username);

    const payload = makeTelemetryPayload({
      deviceId: 'device-batch-1',
      events: [
        { id: 'evt-1', type: 'app.started', occurredAt: '2025-12-21T10:02:00.000Z', details: { screen: 'Main' } },
        { id: 'evt-2', type: 'app.closed', occurredAt: '2025-12-21T10:05:00.000Z' }
      ]
    });

    const res = await service.post('/v1/projects/1/app-users/telemetry')
      .set('Authorization', `Bearer ${login.token}`)
      .send(payload)
      .expect(200)
      .then(({ body }) => body);

    res.should.be.an.Array();
    res.length.should.equal(2);
    res.every((r) => r.status === 'ok').should.equal(true);
    res.map((r) => r.deviceId).every((d) => d === payload.deviceId).should.equal(true);
    res.map((r) => r.appUserId).every((id) => id === appUser.id).should.equal(true);
    res.map((r) => r.clientEventId).should.eql(['evt-1', 'evt-2']);

    const stored = await service.login('alice', (asAlice) =>
      asAlice.get('/v1/system/app-users/telemetry')
        .query({ projectId: 1, deviceId: payload.deviceId, appUserId: appUser.id, limit: 50, offset: 0 })
        .expect(200)
        .then(({ body }) => body));

    stored.length.should.equal(2);
    stored.map((r) => r.clientEventId).sort().should.eql(['evt-1', 'evt-2']);
    const byClientEventId = Object.fromEntries(stored.map((r) => [r.clientEventId, r]));
    byClientEventId['evt-1'].event.should.eql(payload.events[0]);
    byClientEventId['evt-2'].event.should.eql(payload.events[1]);
  }));

  it('should dedupe/upsert replayed events by (appUserId, deviceId, clientEventId)', testService(async (service) => {
    const username = `vguser-telemetry-dedupe-${Math.random().toString(36).slice(2, 8)}`;
    const appUser = await createAppUser(service, { username });
    const login = await loginAppUser(service, username);

    const payload = makeTelemetryPayload({
      deviceId: 'device-dedupe-1',
      events: [{ id: 'evt-replay-1', type: 'token.refreshed', occurredAt: '2025-12-21T10:02:00.000Z' }]
    });

    await service.post('/v1/projects/1/app-users/telemetry')
      .set('Authorization', `Bearer ${login.token}`)
      .send(payload)
      .expect(200);

    await service.post('/v1/projects/1/app-users/telemetry')
      .set('Authorization', `Bearer ${login.token}`)
      .send(payload)
      .expect(200);

    const stored = await service.login('alice', (asAlice) =>
      asAlice.get('/v1/system/app-users/telemetry')
        .query({ projectId: 1, deviceId: payload.deviceId, appUserId: appUser.id, limit: 50, offset: 0 })
        .expect(200)
        .then(({ body }) => body));

    stored.length.should.equal(1);
    stored[0].clientEventId.should.equal('evt-replay-1');
    should.exist(stored[0].event);
    stored[0].event.type.should.equal('token.refreshed');
  }));

  it('should accept telemetry after the bearer token is revoked (queued offline) and report invalidated status', testService(async (service) => {
    const username = `vguser-telemetry-invalidated-${Math.random().toString(36).slice(2, 8)}`;
    const appUser = await createAppUser(service, { username });
    const login = await loginAppUser(service, username);

    // Revoke current session (token becomes invalid for auth middleware).
    await service.post(`/v1/projects/1/app-users/${appUser.id}/revoke`)
      .set('Authorization', `Bearer ${login.token}`)
      .send({ deviceId: 'device-1' })
      .expect(200);

    const payload = makeTelemetryPayload({
      deviceId: 'device-invalidated-1',
      events: [{ id: 'evt-invalidated-1', type: 'app.started', occurredAt: '2025-12-21T10:02:00.000Z' }]
    });

    const res = await service.post('/v1/projects/1/app-users/telemetry')
      .set('Authorization', `Bearer ${login.token}`)
      .send(payload)
      .expect(200)
      .then(({ body }) => body);

    res.should.be.an.Array();
    res.length.should.equal(1);
    res[0].status.should.equal('invalidated');

    const stored = await service.login('alice', (asAlice) =>
      asAlice.get('/v1/system/app-users/telemetry')
        .query({ projectId: 1, deviceId: payload.deviceId, appUserId: appUser.id, limit: 50, offset: 0 })
        .expect(200)
        .then(({ body }) => body));

    stored.length.should.equal(1);
    stored[0].clientEventId.should.equal('evt-invalidated-1');
    should.exist(stored[0].event);
    stored[0].event.type.should.equal('app.started');
  }));
});
