const up = (knex) => knex.schema.table('vg_field_key_auth', (t) => {
  t.unique(['actorId'], 'vg_field_key_auth_actorId_unique');
});

const down = (knex) => knex.schema.table('vg_field_key_auth', (t) => {
  t.dropUnique(['actorId'], 'vg_field_key_auth_actorId_unique');
});

module.exports = { up, down };
