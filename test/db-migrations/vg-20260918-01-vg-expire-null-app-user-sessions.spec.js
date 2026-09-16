const assert = require('node:assert/strict');
const { describeMigration, rowsExistFor } = require('./utils');

describeMigration('20260918-01-vg-expire-null-app-user-sessions', ({ runMigrationBeingTested }) => {
  before(async () => {
    await rowsExistFor('actees', { id: 'vg-null-session-actee', species: 'field_key' });
    await rowsExistFor('actors', {
      id: 700,
      type: 'proxy',
      acteeId: 'vg-null-session-actee',
      displayName: 'VG Null Session Actor'
    });
    await rowsExistFor('vg_app_user_sessions',
      {
        id: 700,
        token: 'vg-null-session-token',
        actorId: 700,
        ip: null,
        user_agent: null,
        device_id: null,
        comments: null,
        createdAt: new Date('2026-09-17T00:00:00Z'),
        expires_at: null
      },
      {
        id: 701,
        token: 'vg-valid-session-token',
        actorId: 700,
        ip: null,
        user_agent: null,
        device_id: null,
        comments: null,
        createdAt: new Date('2026-09-17T00:00:00Z'),
        expires_at: new Date('2099-01-01T00:00:00Z')
      });

    await rowsExistFor('sessions',
      {
        actorId: 700,
        token: 'vg-null-session-token',
        csrf: 'vg-null-session-csrf',
        createdAt: new Date('2026-09-17T00:00:00Z'),
        expiresAt: new Date('2099-01-01T00:00:00Z')
      },
      {
        actorId: 700,
        token: 'vg-valid-session-token',
        csrf: 'vg-valid-session-csrf',
        createdAt: new Date('2026-09-17T00:00:00Z'),
        expiresAt: new Date('2099-01-01T00:00:00Z')
      });

    await runMigrationBeingTested();
  });

  it('expires legacy null-expiry sessions while retaining their rows', async () => {
    const row = await db.one(sql`
      SELECT expires_at
      FROM vg_app_user_sessions
      WHERE token='vg-null-session-token'
    `);
    assert.ok(new Date(row.expires_at).getTime() <= Date.now());
  });

  it('preserves sessions that already have an expiry', async () => {
    const row = await db.one(sql`
      SELECT expires_at
      FROM vg_app_user_sessions
      WHERE token='vg-valid-session-token'
    `);
    assert.equal(new Date(row.expires_at).toISOString(), '2099-01-01T00:00:00.000Z');
  });

  it('expires matching core bearer sessions', async () => {
    const row = await db.one(sql`
      SELECT "expiresAt"
      FROM sessions
      WHERE token='vg-null-session-token'
    `);
    assert.ok(new Date(row.expiresAt).getTime() <= Date.now());
  });

  it('preserves the core session matching non-null VG metadata', async () => {
    const row = await db.one(sql`
      SELECT "expiresAt"
      FROM sessions
      WHERE token='vg-valid-session-token'
    `);
    assert.equal(new Date(row.expiresAt).toISOString(), '2099-01-01T00:00:00.000Z');
  });
});
