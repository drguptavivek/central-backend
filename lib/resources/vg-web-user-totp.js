// VG Web User TOTP Resource Endpoints
//
// REST API endpoints for TOTP 2FA management

const Problem = require('../util/problem');
const { success } = require('../util/http');
const { getOrNotFound } = require('../util/promise');
const {
  setupTotp,
  enableTotp,
  disableTotp,
  regenerateBackupCodes,
  verifyTotpCode
} = require('../domain/vg-web-user-totp');

/**
 * Get client IP from request (respecting X-Forwarded-For)
 */
const getClientIp = (request) => {
  const forwardedFor = request.get('X-Forwarded-For');
  return forwardedFor ? forwardedFor.split(',')[0].trim() : request.ip;
};

module.exports = (service, endpoint) => {
  // POST /v1/users/:id/totp/setup
  // Step 1: Generate TOTP secret and QR code
  // Returns: { secret, qrCode, backupCodes }
  service.post('/users/:id/totp/setup', endpoint(async (container, { auth, params }) => {
    const { Users } = container;
    const actorId = parseInt(params.id, 10);

    // Get user
    const user = await Users.getByActorId(actorId).then(getOrNotFound);

    // Check permissions (user can setup their own TOTP, or admin can do it)
    await auth.canOrReject('user.update', user.actor);

    // Setup TOTP
    const result = await setupTotp(container, actorId, user.email);

    return result;
  }));

  // POST /v1/users/:id/totp/enable
  // Step 2: Verify first TOTP code and enable 2FA
  // Body: { token: "123456" }
  service.post('/users/:id/totp/enable', endpoint(async (container, { auth, params, body }, request) => {
    const { Users } = container;
    const actorId = parseInt(params.id, 10);
    const { token } = body;

    if (!token || typeof token !== 'string') {
      throw Problem.user.missingParameter({ field: 'token' });
    }

    // Get user
    const user = await Users.getByActorId(actorId).then(getOrNotFound);

    // Check permissions
    await auth.canOrReject('user.update', user.actor);

    // Enable TOTP
    const ip = getClientIp(request);
    await enableTotp(container, actorId, ip, token);

    return success();
  }));

  // POST /v1/users/:id/totp/disable
  // Disable TOTP (requires password)
  // Body: { password: "..." }
  service.post('/users/:id/totp/disable', endpoint(async (container, { auth, params, body }) => {
    const { Users } = container;
    const actorId = parseInt(params.id, 10);
    const { password } = body;

    if (!password || typeof password !== 'string') {
      throw Problem.user.missingParameter({ field: 'password' });
    }

    // Get user
    const user = await Users.getByActorId(actorId).then(getOrNotFound);

    // Check permissions
    await auth.canOrReject('user.update', user.actor);

    // Disable TOTP
    await disableTotp(container, actorId, password);

    return success();
  }));

  // POST /v1/users/:id/totp/backup-codes/regenerate
  // Regenerate backup codes (requires password)
  // Body: { password: "..." }
  // Returns: { backupCodes: [...] }
  service.post('/users/:id/totp/backup-codes/regenerate', endpoint(async (container, { auth, params, body }) => {
    const { Users } = container;
    const actorId = parseInt(params.id, 10);
    const { password } = body;

    if (!password || typeof password !== 'string') {
      throw Problem.user.missingParameter({ field: 'password' });
    }

    // Get user
    const user = await Users.getByActorId(actorId).then(getOrNotFound);

    // Check permissions
    await auth.canOrReject('user.update', user.actor);

    // Regenerate codes
    const backupCodes = await regenerateBackupCodes(container, actorId, password);

    return { backupCodes };
  }));

  // POST /v1/sessions/totp-verify
  // Verify TOTP code after initial login
  // Body: { token: "123456", attemptType: "totp" | "backup_code" }
  service.post('/sessions/totp-verify', endpoint(async (container, { auth, body }, request) => {
    const { Sessions } = container;
    const { token, attemptType = 'totp' } = body;

    if (!token || typeof token !== 'string') {
      throw Problem.user.missingParameter({ field: 'token' });
    }

    // Must have an active session (from first phase of login)
    const session = auth.session.orElseThrow(Problem.user.authenticationFailed());

    // Session must not already be verified
    if (session.totp_verified) {
      throw Problem.user.alreadyActive({ feature: 'TOTP verification' });
    }

    const actorId = session.actor.id;
    const ip = getClientIp(request);

    // Verify TOTP code
    await verifyTotpCode(container, actorId, ip, token, attemptType);

    // Mark session as verified
    await Sessions.markTotpVerified(session.token);

    return success();
  }));

  // GET /v1/users/:id/totp/status
  // Check if TOTP is enabled for a user
  // Returns: { enabled: boolean, enabledAt: timestamp | null }
  service.get('/users/:id/totp/status', endpoint(async (container, { auth, params }) => {
    const { Users, VgWebUserTotp } = container;
    const actorId = parseInt(params.id, 10);

    // Get user
    const user = await Users.getByActorId(actorId).then(getOrNotFound);

    // Check permissions (user can check their own status, or admin)
    await auth.canOrReject('user.read', user.actor);

    // Get TOTP status
    const maybeRecord = await VgWebUserTotp.getByActorId(actorId);

    return {
      enabled: maybeRecord.isDefined() ? maybeRecord.get().totp_enabled : false,
      enabledAt: maybeRecord.isDefined() ? maybeRecord.get().totp_enabled_at : null
    };
  }));
};
