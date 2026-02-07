// VG Web User TOTP Domain Logic
//
// Business logic for TOTP 2FA setup, verification, and rate limiting

const Problem = require('../util/problem');
const { hashPassword } = require('../util/crypto');
const { generateSecret, generateQRCode, verifyToken, generateBackupCodes } = require('../util/vg-totp');

const DEFAULT_TOTP_MAX_FAILURES = 5;
const DEFAULT_TOTP_WINDOW_MINUTES = 5;
const DEFAULT_TOTP_LOCK_DURATION_MINUTES = 15;

/**
 * Log audit events for TOTP actions
 */
const logAudit = async (container, actor, action, actee = null, details = {}) => {
  if (!container?.Audits) return;
  const resolvedActor = (actor && actor.id != null) ? actor
    : (actor != null ? { id: actor } : container.context?.auth?.actor.orNull?.() || null);
  const resolvedActee = (actee && acteeId != null) ? { acteeId: actee.acteeId }
    : (actee != null ? { acteeId: actee } : null);
  await container.Audits.log(resolvedActor, action, resolvedActee, details);
};

/**
 * Get rate limit configuration from settings
 */
const getRateLimitConfig = async (VgWebUserTotp) => {
  const [maxFailures, windowMinutes, lockDurationMinutes] = await Promise.all([
    VgWebUserTotp.getSettingValue('vg_totp_max_failures', DEFAULT_TOTP_MAX_FAILURES),
    VgWebUserTotp.getSettingValue('vg_totp_window_minutes', DEFAULT_TOTP_WINDOW_MINUTES),
    VgWebUserTotp.getSettingValue('vg_totp_lock_duration_minutes', DEFAULT_TOTP_LOCK_DURATION_MINUTES)
  ]);
  return { maxFailures, windowMinutes, lockDurationMinutes };
};

/**
 * Check if user is currently locked out due to failed verification attempts
 */
const isLockedOut = async (container, actorId, ip) => {
  const { VgWebUserTotp } = container;
  const { windowMinutes, lockDurationMinutes } = await getRateLimitConfig(VgWebUserTotp);

  const lockoutTime = await VgWebUserTotp.getLatestLockout(actorId, ip);
  if (!lockoutTime) return false;

  const remainingMs = new Date(lockoutTime).getTime() + (lockDurationMinutes * 60 * 1000) - Date.now();
  if (remainingMs <= 0) return false;

  return Math.ceil(remainingMs / 1000); // Return remaining seconds
};

/**
 * Record a failed verification attempt and potentially trigger lockout
 */
const recordFailure = async (container, actorId, ip, attemptType) => {
  const { VgWebUserTotp } = container;
  await VgWebUserTotp.recordAttempt(actorId, ip, false, attemptType);

  const { maxFailures, windowMinutes } = await getRateLimitConfig(VgWebUserTotp);
  const recentFailures = await VgWebUserTotp.getRecentFailures(actorId, ip, windowMinutes);

  if (recentFailures >= maxFailures) {
    await logAudit(container, actorId, 'vg.totp.lockout', actorId, { ip, failures: recentFailures });
    const remainingSeconds = await isLockedOut(container, actorId, ip);
    const error = Problem.user.authenticationFailed();
    error.retryAfterSeconds = remainingSeconds || DEFAULT_TOTP_LOCK_DURATION_MINUTES * 60;
    throw error;
  }
};

/**
 * Setup TOTP for a user (step 1: generate secret and QR code)
 * Returns { secret: base32, qrCode: dataURL, backupCodes: [] }
 */
const setupTotp = async (container, actorId, email) => {
  const { VgWebUserTotp } = container;

  // Check if already enabled
  const existing = await VgWebUserTotp.getByActorId(actorId);
  if (existing && existing.totp_enabled) {
    throw Problem.user.alreadyActive({ feature: 'TOTP 2FA' });
  }

  // Generate new secret and backup codes
  const { secret, encrypted } = generateSecret();
  const qrCode = await generateQRCode(secret, email);
  const backupCodes = generateBackupCodes(10);

  // Hash backup codes before storage
  const hashedCodes = await Promise.all(
    backupCodes.map(code => hashPassword(code))
  );

  // Store encrypted secret and hashed backup codes (not enabled yet)
  await VgWebUserTotp.storeSecret(actorId, encrypted, false);
  await VgWebUserTotp.storeBackupCodes(actorId, hashedCodes);

  await logAudit(container, actorId, 'vg.totp.setup', actorId, { email });

  return {
    secret, // Return plain secret for display (one time only)
    qrCode,
    backupCodes // Return plain codes for user to save
  };
};

/**
 * Enable TOTP after user verifies first code (step 2: verify and activate)
 */
const enableTotp = async (container, actorId, ip, token) => {
  const { VgWebUserTotp } = container;

  // Check rate limiting
  const lockedSeconds = await isLockedOut(container, actorId, ip);
  if (lockedSeconds) {
    const error = Problem.user.authenticationFailed();
    error.retryAfterSeconds = lockedSeconds;
    throw error;
  }

  // Get stored secret
  const record = await VgWebUserTotp.getByActorId(actorId);
  if (!record) {
    throw Problem.user.notFound();
  }

  if (record.totp_enabled) {
    throw Problem.user.alreadyActive({ feature: 'TOTP 2FA' });
  }

  // Verify the token
  const valid = verifyToken(token, record.totp_secret, { encrypted: true });
  if (!valid) {
    await recordFailure(container, actorId, ip, 'totp');
    throw Problem.user.authenticationFailed();
  }

  // Enable TOTP
  await VgWebUserTotp.enable(actorId);
  await VgWebUserTotp.recordAttempt(actorId, ip, true, 'totp');
  await logAudit(container, actorId, 'vg.totp.enable', actorId, { ip });

  return true;
};

/**
 * Disable TOTP for a user
 */
const disableTotp = async (container, actorId, password) => {
  const { VgWebUserTotp, Users } = container;
  const { verifyPassword } = require('../util/crypto');

  // Verify password before disabling
  const user = await Users.getByActorId(actorId);
  if (user.isEmpty()) throw Problem.user.notFound();

  const verified = await verifyPassword(password, user.get().password);
  if (!verified) throw Problem.user.authenticationFailed();

  // Disable TOTP
  await VgWebUserTotp.disable(actorId);
  await logAudit(container, actorId, 'vg.totp.disable', actorId);

  return true;
};

/**
 * Regenerate backup codes
 */
const regenerateBackupCodes = async (container, actorId, password) => {
  const { VgWebUserTotp, Users } = container;
  const { verifyPassword } = require('../util/crypto');

  // Verify password
  const user = await Users.getByActorId(actorId);
  if (user.isEmpty()) throw Problem.user.notFound();

  const verified = await verifyPassword(password, user.get().password);
  if (!verified) throw Problem.user.authenticationFailed();

  // Check TOTP is enabled
  const record = await VgWebUserTotp.getByActorId(actorId);
  if (!record || !record.totp_enabled) {
    throw Problem.user.notFound();
  }

  // Generate new backup codes
  const backupCodes = generateBackupCodes(10);
  const hashedCodes = await Promise.all(
    backupCodes.map(code => hashPassword(code))
  );

  // Replace old codes
  await VgWebUserTotp.deleteBackupCodes(actorId);
  await VgWebUserTotp.storeBackupCodes(actorId, hashedCodes);
  await logAudit(container, actorId, 'vg.totp.backup_codes.regenerate', actorId);

  return backupCodes;
};

/**
 * Verify TOTP code during login
 */
const verifyTotpCode = async (container, actorId, ip, token, attemptType = 'totp') => {
  const { VgWebUserTotp } = container;
  const { verifyPassword } = require('../util/crypto');

  // Check rate limiting
  const lockedSeconds = await isLockedOut(container, actorId, ip);
  if (lockedSeconds) {
    const error = Problem.user.authenticationFailed();
    error.retryAfterSeconds = lockedSeconds;
    throw error;
  }

  // Get TOTP record
  const record = await VgWebUserTotp.getByActorId(actorId);
  if (!record || !record.totp_enabled) {
    throw Problem.user.insufficientRights();
  }

  let valid = false;

  if (attemptType === 'backup_code') {
    // Verify backup code
    const backupCodes = await VgWebUserTotp.getUnusedBackupCodes(actorId);
    for (const codeRecord of backupCodes) {
      const matches = await verifyPassword(token, codeRecord.code_hash);
      if (matches) {
        await VgWebUserTotp.markBackupCodeUsed(codeRecord.id);
        valid = true;
        break;
      }
    }
  } else {
    // Verify TOTP token
    valid = verifyToken(token, record.totp_secret, { encrypted: true });
  }

  if (!valid) {
    await recordFailure(container, actorId, ip, attemptType);
    throw Problem.user.authenticationFailed();
  }

  // Success
  await VgWebUserTotp.recordAttempt(actorId, ip, true, attemptType);
  await logAudit(container, actorId, 'vg.totp.verify.success', actorId, { ip, attemptType });

  return true;
};

/**
 * Check if user needs TOTP verification (has it enabled)
 */
const needsTotpVerification = async (VgWebUserTotp, actorId) => {
  const record = await VgWebUserTotp.getByActorId(actorId);
  return record && record.totp_enabled === true;
};

module.exports = {
  setupTotp,
  enableTotp,
  disableTotp,
  regenerateBackupCodes,
  verifyTotpCode,
  needsTotpVerification,
  isLockedOut
};
