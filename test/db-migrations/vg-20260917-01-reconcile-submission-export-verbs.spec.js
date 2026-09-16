const assert = require('node:assert/strict');
const { describeMigration, rowsExistFor } = require('./utils');

const migrationName = '20260917-01-vg-reconcile-submission-export-verbs';
const exportPolicy = {
  admin: true,
  data_mgr: false,
  manager: true,
  viewer: false,
};

const roleVerbs = async () => db.any(sql`
  SELECT system, ARRAY(
    SELECT jsonb_array_elements_text(verbs) ORDER BY 1
  ) AS verbs
  FROM roles
  WHERE system IN ('admin', 'manager', 'viewer', 'data_mgr')
  ORDER BY system
`);

const exportMatrix = (rows) => Object.fromEntries(
  rows.map(({ system, verbs }) => [system, verbs.includes('submission.export')]),
);

const sortedVerbs = verbs => [...verbs].sort();

describeMigration(migrationName, ({ runMigrationBeingTested }) => {
  let freshRoleVerbs;
  let customRoleVerbs;
  let unrelatedVerbs;

  before(async () => {
    // The harness has run all migrations before this one, giving us the
    // fresh-install baseline to which an upgraded database must converge.
    freshRoleVerbs = await roleVerbs();
    assert.deepEqual(exportMatrix(freshRoleVerbs), exportPolicy);

    unrelatedVerbs = Object.fromEntries(
      freshRoleVerbs.map(({ system, verbs }) => [
        system,
        verbs.filter(verb => verb !== 'submission.export'),
      ]),
    );

    // Simulate upgraded databases that received the role-verb edits in
    // different historical states: manager lost export, while viewer and data
    // manager gained it.
    await db.query(sql`
      UPDATE roles
      SET verbs = verbs - 'submission.export'
      WHERE system = 'manager'
    `);
    await db.query(sql`
      UPDATE roles
      SET verbs = verbs || '["submission.export"]'::jsonb
      WHERE system IN ('viewer', 'data_mgr')
    `);

    // A custom role is an explicit guard that the migration remains scoped to
    // the four system roles in the policy matrix.
    customRoleVerbs = [ 'custom.keep', 'submission.export' ];
    await rowsExistFor('roles', {
      name: 'VG custom export role',
      system: 'custom',
      verbs: customRoleVerbs,
    });

    await runMigrationBeingTested();
  });

  it('reconciles the exact four-role export matrix', async () => {
    const rows = await roleVerbs();
    assert.equal(rows.length, 4);
    assert.deepEqual(exportMatrix(rows), exportPolicy);
  });

  it('preserves unrelated verbs and converges upgraded roles to the fresh baseline', async () => {
    const rows = await roleVerbs();
    const actualUnrelatedVerbs = Object.fromEntries(
      rows.map(({ system, verbs }) => [
        system,
        verbs.filter(verb => verb !== 'submission.export'),
      ]),
    );
    assert.deepEqual(actualUnrelatedVerbs, unrelatedVerbs);

    const expectedFreshVerbs = Object.fromEntries(
      freshRoleVerbs.map(({ system, verbs }) => [system, sortedVerbs(verbs)]),
    );
    assert.deepEqual(
      Object.fromEntries(rows.map(({ system, verbs }) => [system, sortedVerbs(verbs)])),
      expectedFreshVerbs,
    );
  });

  it('leaves unrelated custom roles unchanged', async () => {
    const row = await db.one(sql`
      SELECT ARRAY(
        SELECT jsonb_array_elements_text(verbs) ORDER BY 1
      ) AS verbs
      FROM roles
      WHERE system = 'custom'
    `);
    assert.deepEqual(row.verbs, sortedVerbs(customRoleVerbs));
  });
});
