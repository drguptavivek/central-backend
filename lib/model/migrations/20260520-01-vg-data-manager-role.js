const dataManagerVerbs = [
  'project.read',
  'form.list', 'form.read',
  'submission.list', 'submission.read', 'submission.update', 'submission.delete', 'submission.restore',
  'field_key.list', 'field_key.create', 'field_key.update', 'field_key.delete',
  'assignment.list',
  'session.end',
  'vg_form_access.update',
  'vg_telemetry.read'
];

const exportVerbs = [
  'submission.export',
  'vg_form_access.update',
  'vg_telemetry.read'
];

const up = async (db) => {
  await db.insert({
    name: 'Data Manager',
    system: 'data_mgr',
    verbs: JSON.stringify(dataManagerVerbs)
  }).into('roles');

  await db.raw(`
    UPDATE roles
    SET verbs = (
      SELECT jsonb_agg(DISTINCT verb)
      FROM jsonb_array_elements(roles.verbs || ?::jsonb) AS verb
    )
    WHERE system in ('admin', 'manager')
  `, [JSON.stringify(exportVerbs)]);

  await db.raw(`
    UPDATE roles
    SET verbs = (
      SELECT jsonb_agg(DISTINCT verb)
      FROM jsonb_array_elements(roles.verbs || '["submission.export"]'::jsonb) AS verb
    )
    WHERE system = 'viewer'
  `);
};

const down = async (db) => {
  await db.delete().from('roles').where({ system: 'data_mgr' });
  await db.raw(`
    UPDATE roles
    SET verbs = verbs - 'submission.export' - 'vg_form_access.update' - 'vg_telemetry.read'
    WHERE system in ('admin', 'manager', 'viewer')
  `);
};

module.exports = { up, down };
