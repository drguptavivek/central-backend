const assert = require('node:assert/strict');
const { describeMigration, rowsExistFor } = require('./utils');

describeMigration('20260902-01-vg-repair-null-submission-events', ({ runMigrationBeingTested }) => {
  before(async () => {
    await rowsExistFor('actees',
      { id: 'vg-repair-project', species: 'project' },
      { id: 'vg-repair-form', species: 'form' });
    await rowsExistFor('projects',
      { id: 10, name: 'VG repair migration test', acteeId: 'vg-repair-project' });
    await rowsExistFor('forms',
      { id: 10, xmlFormId: 'vg-repair-form', acteeId: 'vg-repair-form', projectId: 10 });

    await db.query(sql`ALTER TABLE submissions DISABLE TRIGGER set_eventstamp_submissions_at_commit`);
    await rowsExistFor('submissions',
      { id: 10, formId: 10, instanceId: 'vg-valid-event', draft: false, event: 10 },
      { id: 11, formId: 10, instanceId: 'vg-null-event-1', draft: false, event: null },
      { id: 12, formId: 10, instanceId: 'vg-null-event-2', draft: false, event: null });
    await db.query(sql`ALTER TABLE submissions ENABLE TRIGGER set_eventstamp_submissions_at_commit`);

    runMigrationBeingTested();
  });

  it('fills only null legacy events after the existing maximum', async () => {
    const rows = await db.any(sql`SELECT id, event FROM submissions ORDER BY id`);
    assert.deepEqual(rows, [
      { id: 1, event: 1 },
      { id: 2, event: 2 },
      { id: 10, event: 10 },
      { id: 11, event: 11 },
      { id: 12, event: 12 }
    ]);
    assert.equal(await db.oneFirst(sql`SELECT event FROM current_event`), 12);
  });
});
