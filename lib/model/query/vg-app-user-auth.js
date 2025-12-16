// Namespaced vg app-user auth queries and helpers.
const { sql } = require('slonik');
const { Frame, readable, table, embedded, into } = require('../frame');
const { Actor } = require('../frames');
const { unjoiner } = require('../../util/db');

const normalizeUsername = (username) => username.trim().toLowerCase();

// Frame for vg_field_key_auth joined with field_keys to expose projectId/actorId.
const VgFieldKeyAuth = Frame.define(
  table('vg_field_key_auth'),
  'actorId', readable,
  'vg_username', readable,
  'vg_password_hash',
  'vg_phone', readable,
  'vg_active', readable,
  embedded('fieldKey')
);
VgFieldKeyAuth.FieldKey = Frame.define(table('field_keys'), into('fieldKey'), 'projectId', readable);
VgFieldKeyAuth.Actor = Frame.define(table('actors'), into('actor'), 'id', readable, 'acteeId', readable);

const vgFieldKeyAuthUnjoiner = unjoiner(VgFieldKeyAuth, VgFieldKeyAuth.FieldKey, VgFieldKeyAuth.Actor);

const insertAuth = ({ actorId, username, passwordHash, phone = null, active = true }) => ({ run }) => {
  const vgUsername = normalizeUsername(username);
  return run(sql`
    INSERT INTO vg_field_key_auth ("actorId", vg_username, vg_password_hash, vg_phone, vg_active)
    VALUES (${actorId}, ${vgUsername}, ${passwordHash}, ${phone}, ${active})
  `);
};

const getByUsername = (username) => ({ maybeOne }) => {
  const vgUsername = normalizeUsername(username);
  return maybeOne(sql`
    SELECT ${vgFieldKeyAuthUnjoiner.fields} FROM vg_field_key_auth
    JOIN field_keys ON field_keys."actorId" = vg_field_key_auth."actorId"
    JOIN actors ON actors.id = vg_field_key_auth."actorId"
    WHERE vg_username=${vgUsername}
  `).then((opt) => opt.map(vgFieldKeyAuthUnjoiner));
};

const updatePassword = (actorId, passwordHash) => ({ run }) =>
  run(sql`UPDATE vg_field_key_auth SET vg_password_hash=${passwordHash} WHERE "actorId"=${actorId}`);

const setActive = (actorId, active) => ({ run }) =>
  run(sql`UPDATE vg_field_key_auth SET vg_active=${active} WHERE "actorId"=${actorId}`);

const updatePhone = (actorId, phone) => ({ run }) =>
  run(sql`UPDATE vg_field_key_auth SET vg_phone=${phone} WHERE "actorId"=${actorId}`);

const getSessionTtlDays = () => ({ maybeOne }) =>
  maybeOne(sql`SELECT vg_key_value FROM vg_settings WHERE vg_key_name='vg_app_user_session_ttl_days' LIMIT 1`)
    .then((opt) => opt.map((row) => Number(row.vg_key_value)).orElse(3));

const getSessionCap = () => ({ maybeOne }) =>
  maybeOne(sql`SELECT vg_key_value FROM vg_settings WHERE vg_key_name='vg_app_user_session_cap' LIMIT 1`)
    .then((opt) => opt.map((row) => Number(row.vg_key_value)).orElse(3));

const recordAttempt = (username, ip, succeeded) => ({ run }) => {
  const vgUsername = normalizeUsername(username);
  return run(sql`
    INSERT INTO vg_app_user_login_attempts (username, ip, succeeded)
    VALUES (${vgUsername}, ${ip}, ${succeeded})
  `);
};

const getLockStatus = (username, ip) => ({ maybeOne }) => {
  const vgUsername = normalizeUsername(username);
  return maybeOne(sql`
    SELECT
      count(*) FILTER (WHERE succeeded = false AND "createdAt" >= now() - interval '5 minutes') AS recent_failures,
      max("createdAt") FILTER (WHERE succeeded = false) AS last_failure
    FROM vg_app_user_login_attempts
    WHERE username=${vgUsername} ${ip != null ? sql`AND ip=${ip}` : sql``}
  `).then((opt) => opt.orElse({ recent_failures: 0, last_failure: null }));
};

const getByActorId = (actorId) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT ${vgFieldKeyAuthUnjoiner.fields} FROM vg_field_key_auth
    JOIN field_keys ON field_keys."actorId" = vg_field_key_auth."actorId"
    JOIN actors ON actors.id = vg_field_key_auth."actorId"
    WHERE vg_field_key_auth."actorId"=${actorId}
  `).then((opt) => opt.map(vgFieldKeyAuthUnjoiner));

module.exports = {
  insertAuth,
  getByUsername,
  getByActorId,
  updatePassword,
  setActive,
  updatePhone,
  getSessionTtlDays,
  getSessionCap,
  recordAttempt,
  getLockStatus,
  normalizeUsername
};
