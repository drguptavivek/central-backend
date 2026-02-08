// VG Web User TOTP Query Module
//
// Database operations for TOTP 2FA

const { sql } = require('slonik');

/**
 * Get TOTP record for a user
 */
const getByActorId = (actorId) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT "actorId", totp_secret, totp_enabled, totp_enabled_at, created_at, updated_at
    FROM vg_web_user_totp
    WHERE "actorId" = ${actorId}
  `);

/**
 * Store or update TOTP secret for a user
 */
const storeSecret = (actorId, encryptedSecret, enabled = false) => ({ run }) =>
  run(sql`
    INSERT INTO vg_web_user_totp ("actorId", totp_secret, totp_enabled, updated_at)
    VALUES (${actorId}, ${encryptedSecret}, ${enabled}, now())
    ON CONFLICT ("actorId") DO UPDATE
      SET totp_secret = EXCLUDED.totp_secret,
          totp_enabled = EXCLUDED.totp_enabled,
          updated_at = now()
  `);

/**
 * Enable TOTP for a user
 */
const enable = (actorId) => ({ run }) =>
  run(sql`
    UPDATE vg_web_user_totp
    SET totp_enabled = true,
        totp_enabled_at = now(),
        updated_at = now()
    WHERE "actorId" = ${actorId}
  `);

/**
 * Disable TOTP for a user
 */
const disable = (actorId) => ({ run }) =>
  run(sql`
    UPDATE vg_web_user_totp
    SET totp_enabled = false,
        totp_enabled_at = NULL,
        updated_at = now()
    WHERE "actorId" = ${actorId}
  `);

/**
 * Store backup codes for a user (hashed with bcrypt)
 */
const storeBackupCodes = (actorId, hashedCodes) => ({ run }) => {
  const values = hashedCodes.map(hash =>
    sql`(${actorId}, ${hash}, now())`
  );
  return run(sql`
    INSERT INTO vg_web_user_totp_backup_codes ("actorId", code_hash, created_at)
    VALUES ${sql.join(values, sql`, `)}
  `);
};

/**
 * Get unused backup codes for a user
 */
const getUnusedBackupCodes = (actorId) => ({ all }) =>
  all(sql`
    SELECT id, "actorId", code_hash, used_at, created_at
    FROM vg_web_user_totp_backup_codes
    WHERE "actorId" = ${actorId}
      AND used_at IS NULL
    ORDER BY created_at DESC
  `);

/**
 * Mark a backup code as used
 */
const markBackupCodeUsed = (codeId) => ({ run }) =>
  run(sql`
    UPDATE vg_web_user_totp_backup_codes
    SET used_at = now()
    WHERE id = ${codeId}
  `);

/**
 * Delete all backup codes for a user (for regeneration)
 */
const deleteBackupCodes = (actorId) => ({ run }) =>
  run(sql`
    DELETE FROM vg_web_user_totp_backup_codes
    WHERE "actorId" = ${actorId}
  `);

/**
 * Record a TOTP verification attempt
 */
const recordAttempt = (actorId, ip, success, attemptType) => ({ run }) =>
  run(sql`
    INSERT INTO vg_web_user_totp_attempts ("actorId", ip, success, attempt_type, created_at)
    VALUES (${actorId}, ${ip}, ${success}, ${attemptType}, now())
  `);

/**
 * Get recent failed attempts for rate limiting
 */
const getRecentFailures = (actorId, ip, windowMinutes) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT COUNT(*)::int AS count
    FROM vg_web_user_totp_attempts
    WHERE "actorId" = ${actorId}
      AND ${ip == null ? sql`ip IS NULL` : sql`ip = ${ip}`}
      AND success = false
      AND created_at >= now() - (${windowMinutes} * interval '1 minute')
  `).then((opt) => opt.map((row) => row.count).orElse(0));

/**
 * Get latest lockout timestamp (most recent failed attempt that triggered lockout)
 */
const getLatestLockout = (actorId, ip) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT created_at
    FROM vg_web_user_totp_attempts
    WHERE "actorId" = ${actorId}
      AND ${ip == null ? sql`ip IS NULL` : sql`ip = ${ip}`}
      AND success = false
    ORDER BY created_at DESC
    LIMIT 1
  `).then((opt) => opt.map((row) => row.created_at).orElse(null));

/**
 * Get setting value from vg_settings
 */
const toPositiveIntOr = (value, fallback) => {
  const num = Number(value);
  return (Number.isFinite(num) && Number.isInteger(num) && num > 0) ? num : fallback;
};

const getSettingValue = (key, fallback) => ({ maybeOne }) =>
  maybeOne(sql`SELECT vg_key_value FROM vg_settings WHERE vg_key_name=${key} LIMIT 1`)
    .then((opt) => opt.map((row) => toPositiveIntOr(row.vg_key_value, fallback)).orElse(fallback));

/**
 * Check if user's role requires mandatory TOTP enrollment
 * Checks if user has a system-level assignment matching mandatory roles setting
 */
const isRoleMandatoryForTotp = (actorId) => ({ maybeOne, all }) =>
  Promise.all([
    // Get user's system-level roles (acteeId = '*')
    all(sql`
      SELECT r.system AS role_name
      FROM assignments a
      INNER JOIN roles r ON a."roleId" = r.id
      WHERE a."actorId" = ${actorId}
        AND a."acteeId" = '*'
    `),
    // Get mandatory roles setting
    maybeOne(sql`
      SELECT vg_key_value
      FROM vg_settings
      WHERE vg_key_name = 'vg_totp_mandatory_roles'
    `)
  ]).then(([userRoles, maybeSetting]) => {
    if (userRoles.length === 0) return false;

    const userRoleNames = userRoles.map(r => r.role_name);
    const mandatoryRolesJson = maybeSetting.map(row => row.vg_key_value).orElse('["admin"]');
    const mandatoryRoles = JSON.parse(mandatoryRolesJson);

    // Check if any of the user's roles are in the mandatory list
    return userRoleNames.some(roleName => mandatoryRoles.includes(roleName));
  });

/**
 * Check if user should be prompted for TOTP enrollment (non-mandatory users only)
 */
const shouldPromptEnrollment = (actorId) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT
      totp_enabled,
      totp_prompt_dismissed_at,
      totp_prompt_remind_after
    FROM vg_web_user_totp
    WHERE "actorId" = ${actorId}
  `).then((maybeRecord) => {
    if (!maybeRecord.isDefined()) {
      // No record = never enabled, never prompted → SHOULD PROMPT
      return true;
    }

    const record = maybeRecord.get();

    // Already has TOTP enabled → DON'T PROMPT
    if (record.totp_enabled) return false;

    // Dismissed permanently → DON'T PROMPT
    if (record.totp_prompt_dismissed_at != null) return false;

    // Remind later date set and not yet passed → DON'T PROMPT
    if (record.totp_prompt_remind_after != null &&
        new Date(record.totp_prompt_remind_after) > new Date()) {
      return false;
    }

    // Otherwise → SHOULD PROMPT
    return true;
  });

/**
 * Dismiss enrollment prompt (permanently or with reminder)
 * NOTE: Only works for non-mandatory users; mandatory users cannot dismiss
 */
const dismissEnrollmentPrompt = (actorId, remindAfterDays = null) => ({ run }) => {
  if (remindAfterDays === null) {
    // Permanent dismissal
    return run(sql`
      INSERT INTO vg_web_user_totp ("actorId", totp_prompt_dismissed_at, created_at, updated_at)
      VALUES (${actorId}, now(), now(), now())
      ON CONFLICT ("actorId")
      DO UPDATE SET
        totp_prompt_dismissed_at = now(),
        totp_prompt_remind_after = NULL,
        updated_at = now()
    `);
  } else {
    // Remind later
    const remindAfter = new Date();
    remindAfter.setDate(remindAfter.getDate() + remindAfterDays);

    return run(sql`
      INSERT INTO vg_web_user_totp ("actorId", totp_prompt_remind_after, created_at, updated_at)
      VALUES (${actorId}, ${remindAfter.toISOString()}, now(), now())
      ON CONFLICT ("actorId")
      DO UPDATE SET
        totp_prompt_remind_after = ${remindAfter.toISOString()},
        totp_prompt_dismissed_at = NULL,
        updated_at = now()
    `);
  }
};

module.exports = {
  getByActorId,
  storeSecret,
  enable,
  disable,
  storeBackupCodes,
  getUnusedBackupCodes,
  markBackupCodeUsed,
  deleteBackupCodes,
  recordAttempt,
  getRecentFailures,
  getLatestLockout,
  getSettingValue,
  // Enrollment prompt methods
  isRoleMandatoryForTotp,
  shouldPromptEnrollment,
  dismissEnrollmentPrompt
};
