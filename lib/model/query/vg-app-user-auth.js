// Namespaced vg app-user auth queries and helpers.
const { sql } = require('slonik');
const { Frame, readable, table, embedded, into } = require('../frame');
const { Actor } = require('../frames');
const { unjoiner, page, QueryOptions } = require('../../util/db');

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
    ON CONFLICT ("actorId") DO UPDATE
      SET vg_username = EXCLUDED.vg_username,
          vg_password_hash = EXCLUDED.vg_password_hash,
          vg_phone = EXCLUDED.vg_phone,
          vg_active = EXCLUDED.vg_active
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

const toPositiveIntOr = (value, fallback) => {
  const num = Number(value);
  return (Number.isFinite(num) && Number.isInteger(num) && num > 0) ? num : fallback;
};

const getSettingValue = (key, fallback) => ({ maybeOne }) =>
  maybeOne(sql`SELECT vg_key_value FROM vg_settings WHERE vg_key_name=${key} LIMIT 1`)
    .then((opt) => opt.map((row) => toPositiveIntOr(row.vg_key_value, fallback)).orElse(fallback));

const getSessionTtlDays = () => getSettingValue('vg_app_user_session_ttl_days', 3);

const getSessionCap = () => getSettingValue('vg_app_user_session_cap', 3);

const getAdminPw = () => ({ maybeOne }) =>
  maybeOne(sql`SELECT vg_key_value FROM vg_settings WHERE vg_key_name='admin_pw' LIMIT 1`)
    .then((opt) => opt.map((row) => row.vg_key_value).orElse('vg_custom'));

const upsertSetting = (key, value) => ({ run }) =>
  run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value) VALUES (${key}, ${value})
    ON CONFLICT (vg_key_name) DO UPDATE SET vg_key_value=${value}
  `);

const getSettingWithProjectOverride = (projectId, key, fallback) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT COALESCE(
      (SELECT vg_key_value FROM vg_project_settings WHERE "projectId"=${projectId} AND vg_key_name=${key} LIMIT 1),
      (SELECT vg_key_value FROM vg_settings WHERE vg_key_name=${key} LIMIT 1),
      ${String(fallback)}
    ) AS value
  `).then((opt) => opt.map((row) => toPositiveIntOr(row.value, fallback)).orElse(fallback));

const recordAttempt = (username, ip, succeeded) => ({ run }) => {
  const vgUsername = normalizeUsername(username);
  return run(sql`
    INSERT INTO vg_app_user_login_attempts (username, ip, succeeded)
    VALUES (${vgUsername}, ${ip}, ${succeeded})
  `);
};

const recordLockout = (username, ip, durationMinutes) => ({ run }) => {
  const vgUsername = normalizeUsername(username);
  return run(sql`
    INSERT INTO vg_app_user_lockouts (username, ip, locked_until)
    VALUES (${vgUsername}, ${ip}, now() + (${durationMinutes} * interval '1 minute'))
  `);
};

const getActiveLockout = (username, ip) => ({ maybeOne }) => {
  const vgUsername = normalizeUsername(username);
  const ipFilter = (ip == null) ? sql`AND ip IS NULL` : sql`AND ip=${ip}`;
  return maybeOne(sql`
    SELECT max(locked_until) AS locked_until
    FROM vg_app_user_lockouts
    WHERE username=${vgUsername} ${ipFilter}
  `).then((opt) => opt.map((row) => row.locked_until).orElse(null));
};

const recordSession = ({ token, actorId, ip = null, userAgent = null, deviceId = null, comments = null, createdAt = null, expiresAt = null }) => ({ run }) => {
  // Ensure undefined values are converted to null (Slonik doesn't accept undefined)
  // Required fields - throw if missing
  if (token == null) throw new Error('recordSession: token is required');
  if (actorId == null) throw new Error('recordSession: actorId is required');

  // Optional fields - normalize to null if undefined
  const normalizedIp = ip ?? null;
  const normalizedUserAgent = userAgent ?? null;
  const normalizedDeviceId = deviceId ?? null;
  const normalizedComments = comments ?? null;
  // Convert Date to ISO string for Slonik, or null
  const normalizedExpiresAt = (expiresAt instanceof Date) ? expiresAt.toISOString() : (expiresAt ?? null);

  return run(sql`
    INSERT INTO vg_app_user_sessions (token, "actorId", ip, user_agent, device_id, comments, expires_at)
    VALUES (${token}, ${actorId}, ${normalizedIp}, ${normalizedUserAgent}, ${normalizedDeviceId}, ${normalizedComments}, ${normalizedExpiresAt})
    ON CONFLICT (token) DO UPDATE
      SET "actorId" = EXCLUDED."actorId",
          ip = EXCLUDED.ip,
          user_agent = EXCLUDED.user_agent,
          device_id = EXCLUDED.device_id,
          comments = EXCLUDED.comments,
          expires_at = EXCLUDED.expires_at
  `);
};

const normalizeExpiresAt = (expiresAt) =>
  (expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt);

const getSessionById = (sessionId) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT
      v.id,
      v.token,
      v."actorId",
      v."createdAt",
      v.expires_at,
      v.ip,
      v.user_agent,
      v.device_id,
      v.comments,
      a."acteeId" as acteeId,
      fk."projectId",
      vga.vg_username
    FROM vg_app_user_sessions v
    LEFT JOIN actors a ON a.id = v."actorId"
    LEFT JOIN field_keys fk ON fk."actorId" = v."actorId"
    LEFT JOIN vg_field_key_auth vga ON vga."actorId" = v."actorId"
    WHERE v.id = ${sessionId}
  `);

const getSessionByToken = (token) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT
      v.token,
      v."actorId",
      fk."projectId",
      v.expires_at
    FROM vg_app_user_sessions v
    JOIN field_keys fk ON fk."actorId" = v."actorId"
    WHERE v.token = ${token}
      AND (v.expires_at IS NULL OR v.expires_at > now() - interval '2 days')
    LIMIT 1
  `);

const expireSessionById = (sessionId, expiresAt) => ({ run }) =>
  run(sql`
    UPDATE vg_app_user_sessions
    SET expires_at = ${normalizeExpiresAt(expiresAt)}
    WHERE id = ${sessionId}
  `);

const expireSessionByToken = (token, expiresAt) => ({ run }) =>
  run(sql`
    UPDATE vg_app_user_sessions
    SET expires_at = ${normalizeExpiresAt(expiresAt)}
    WHERE token = ${token}
  `);

const getSessionsByActorId = (actorId, options = QueryOptions.none) => ({ all }) =>
  all(sql`
    SELECT
      count(*) OVER () AS total_count,
      v.token,
      v."createdAt",
      v.expires_at,
      v.id,
      v.ip,
      v.user_agent,
      v.device_id,
      v.comments
    FROM vg_app_user_sessions v
    WHERE v."actorId"=${actorId}
    ORDER BY v."createdAt" DESC
    ${page(options)}
  `);

const projectSessionFilterer = (filters) => {
  const conditions = [];
  if (filters.projectId != null) conditions.push(sql`fk."projectId"=${filters.projectId}`);
  if (filters.appUserId != null) conditions.push(sql`v."actorId"=${filters.appUserId}`);
  if (filters.dateFrom != null) conditions.push(sql`v."createdAt" >= ${filters.dateFrom}`);
  if (filters.dateTo != null) conditions.push(sql`v."createdAt" <= ${filters.dateTo}`);
  return (conditions.length === 0) ? sql`true` : sql.join(conditions, sql` and `);
};

const getSessionsByProject = (filters = {}, options = QueryOptions.none) => ({ all }) =>
  all(sql`
    SELECT
      count(*) OVER () AS total_count,
      v."actorId" AS "appUserId",
      v."createdAt",
      v.expires_at,
      v.id,
      v.ip,
      v.user_agent,
      v.device_id,
      v.comments
    FROM vg_app_user_sessions v
    JOIN field_keys fk ON fk."actorId" = v."actorId"
    WHERE ${projectSessionFilterer(filters)}
    ORDER BY v."createdAt" DESC
    ${page(options)}
  `);

const clearLockout = (username, ip) => ({ run }) => {
  const vgUsername = normalizeUsername(username);
  const ipFilter = (ip == null) ? sql`AND ip IS NULL` : sql`AND ip=${ip}`;
  return run(sql`
    DELETE FROM vg_app_user_login_attempts
    WHERE username=${vgUsername}
    ${ipFilter}
      AND succeeded = false
  `).then(() => run(sql`
    DELETE FROM vg_app_user_lockouts
    WHERE username=${vgUsername}
    ${ipFilter}
  `));
};

const getLockStatus = (username, ip, windowMinutes) => ({ maybeOne }) => {
  const vgUsername = normalizeUsername(username);
  const ipFilter = (ip == null) ? sql`AND ip IS NULL` : sql`AND ip=${ip}`;
  return maybeOne(sql`
    SELECT
      count(*) FILTER (WHERE succeeded = false AND "createdAt" >= now() - (${windowMinutes} * interval '1 minute')) AS recent_failures,
      max("createdAt") FILTER (WHERE succeeded = false) AS last_failure
    FROM vg_app_user_login_attempts
    WHERE username=${vgUsername} ${ipFilter}
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
  getAdminPw,
  upsertSetting,
  getSettingValue,
  getSettingWithProjectOverride,
  recordAttempt,
  recordLockout,
  getActiveLockout,
  recordSession,
  getSessionById,
  getSessionByToken,
  expireSessionById,
  expireSessionByToken,
  getSessionsByActorId,
  getSessionsByProject,
  clearLockout,
  getLockStatus,
  normalizeUsername
};
