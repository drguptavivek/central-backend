const assert = require('node:assert/strict');
const { describeMigration, rowsExistFor } = require('./utils');

describeMigration('20260115-01-submission-event-stamping-unshared-events', ({ runMigrationBeingTested }) => {
  before(async () => {
    await rowsExistFor('actees',
      { id: 'vg-migration-project', species: 'project' },
      { id: 'vg-migration-form', species: 'form' });
    await rowsExistFor('projects',
      { id: 1, name: 'VG migration test', acteeId: 'vg-migration-project' });
    await rowsExistFor('forms',
      { id: 1, xmlFormId: 'vg-migration-form', acteeId: 'vg-migration-form', projectId: 1 });
    await rowsExistFor('submissions',
      { id: 1, formId: 1, instanceId: 'vg-legacy-1', draft: false, event: 7 },
      { id: 2, formId: 1, instanceId: 'vg-legacy-2', draft: false, event: 7 });

    runMigrationBeingTested();
  });

  it('renumbers duplicate legacy events without leaving null event stamps', async () => {
    const rows = await db.any(sql`SELECT id, event FROM submissions ORDER BY id`);
    assert.deepEqual(rows, [{ id: 1, event: 1 }, { id: 2, event: 2 }]);
    assert.equal(await db.oneFirst(sql`SELECT event FROM current_event`), 2);
  });

  it('creates the unique event index and restores both event triggers', async () => {
    const indexCount = await db.oneFirst(sql`
      SELECT count(*)::int
      FROM pg_indexes
      WHERE tablename = 'submissions'
        AND indexname = 'submission_event_idx'
        AND indexdef LIKE 'CREATE UNIQUE INDEX%'
    `);
    assert.equal(indexCount, 1);

    const triggers = await db.any(sql`
      SELECT tgname, tgenabled
      FROM pg_trigger
      WHERE tgrelid = 'submissions'::regclass
        AND tgname IN ('blank_submissions_event_on_update', 'set_eventstamp_submissions_at_commit')
      ORDER BY tgname
    `);
    assert.deepEqual(triggers, [
      { tgname: 'blank_submissions_event_on_update', tgenabled: 'O' },
      { tgname: 'set_eventstamp_submissions_at_commit', tgenabled: 'O' }
    ]);
  });
});
