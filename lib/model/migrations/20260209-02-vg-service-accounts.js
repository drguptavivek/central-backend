// VG: Service Account Flag
// Add is_service_account column to users table

const up = (knex) => knex.raw(require('fs').readFileSync(__dirname + '/20260209-02-vg-service-accounts.up.sql', 'utf8'));
const down = (knex) => knex.raw(require('fs').readFileSync(__dirname + '/20260209-02-vg-service-accounts.down.sql', 'utf8'));

module.exports = { up, down };
