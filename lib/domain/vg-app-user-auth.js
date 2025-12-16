// Domain logic for vg app-user auth flows.
const Problem = require('../util/problem');
const { verifyPassword, hashPassword } = require('../util/crypto');
const { validateVgPassword } = require('../util/vg-password');
const { FieldKey } = require('../model/frames');
const { isBlank } = require('../util/util');

const LOCK_MAX_FAILURES = 5;
const LOCK_WINDOW_MINUTES = 5;
const LOCK_DURATION_MINUTES = 10;
const USERNAME_PATTERN = /^[a-z0-9._-]+$/i;
const NON_ASCII = /[^\x20-\x7E]/;

const getLock = async (VgAppUserAuth, username, ip) => {
  const status = await VgAppUserAuth.getLockStatus(username, ip);
  const recentFailures = Number(status.recent_failures || 0);
  const lastFailure = status.last_failure ? new Date(status.last_failure) : null;
  if (recentFailures >= LOCK_MAX_FAILURES && lastFailure != null) {
    const diffMs = Date.now() - lastFailure.getTime();
    if (diffMs < LOCK_DURATION_MINUTES * 60 * 1000) return true;
  }
  return false;
};

const ensurePasswordPolicy = (password) => {
  if (!validateVgPassword(password))
    throw Problem.user.invalidEntity({ reason: 'Password does not meet policy.' });
};

const validateUsername = (username, payload) => {
  if (typeof username !== 'string') throw Problem.user.missingParameters({ expected: ['username'], got: payload });
  const normalized = username.trim().toLowerCase();
  if (normalized === '') throw Problem.user.missingParameters({ expected: ['username'], got: payload });
  if (NON_ASCII.test(normalized) || !USERNAME_PATTERN.test(normalized))
    throw Problem.user.invalidEntity({ reason: 'Username contains invalid characters.' });
  return normalized;
};

const createAppUser = async (container, project, payload, createdBy) => {
  const { FieldKeys, VgAppUserAuth } = container;
  const { username, password, phone, fullName, active = true } = payload;
  const cleanedUsername = validateUsername(username, payload);
  ensurePasswordPolicy(password);
  const hash = await hashPassword(password);
  // Create field key without session, then attach vg auth.
  const fk = await FieldKeys.createWithoutSession(
    FieldKey.fromApi({ displayName: fullName })
      .with({ createdBy: createdBy ?? null }),
    project
  );
  await VgAppUserAuth.insertAuth({ actorId: fk.actor.id, username: cleanedUsername, passwordHash: hash, phone, active });
  return fk;
};

const login = async (container, { username, password, ip }) => {
  const { VgAppUserAuth, Sessions } = container;
  const locked = await getLock(VgAppUserAuth, username, ip);
  if (locked) throw Problem.user.authenticationFailed();

  const auth = await VgAppUserAuth.getByUsername(username);
  if (auth.isEmpty() || auth.get().vg_active !== true) {
    await VgAppUserAuth.recordAttempt(username, ip, false);
    throw Problem.user.authenticationFailed();
  }
  const record = auth.get();
  const projectId = record.aux?.fieldKey?.projectId ?? record.projectId;
  const ok = await verifyPassword(password, record.vg_password_hash);
  if (!ok) {
    await VgAppUserAuth.recordAttempt(username, ip, false);
    throw Problem.user.authenticationFailed();
  }
  await VgAppUserAuth.recordAttempt(username, ip, true);
  const ttlDays = await VgAppUserAuth.getSessionTtlDays();
  const sessionCap = await VgAppUserAuth.getSessionCap();
  const expiresAt = new Date(Date.now() + Number(ttlDays) * 24 * 60 * 60 * 1000);
  const session = await Sessions.create({ id: record.actorId }, expiresAt);
  await Sessions.trimByActorId(record.actorId, sessionCap);
  return { token: session.token, projectId };
};

const changePassword = async (container, actorId, { oldPassword, newPassword }) => {
  const { VgAppUserAuth, Sessions } = container;
  const auth = await VgAppUserAuth.getByActorId(actorId);
  if (auth.isEmpty()) throw Problem.user.notFound();
  const record = auth.get();
  const ok = await verifyPassword(oldPassword, record.vg_password_hash);
  if (!ok) throw Problem.user.authenticationFailed();
  ensurePasswordPolicy(newPassword);
  const hash = await hashPassword(newPassword);
  await VgAppUserAuth.updatePassword(actorId, hash);
  await Sessions.terminateByActorId(actorId);
  return true;
};

const resetPassword = async (container, actorId, { newPassword }) => {
  const { VgAppUserAuth, Sessions } = container;
  ensurePasswordPolicy(newPassword);
  const hash = await hashPassword(newPassword);
  await VgAppUserAuth.updatePassword(actorId, hash);
  await Sessions.terminateByActorId(actorId);
  return true;
};

const revokeSessions = async (container, actorId, currentToken) => {
  const { Sessions } = container;
  await Sessions.terminateByActorId(actorId, currentToken);
  return true;
};

const setActive = async (container, actorId, active) => {
  const { VgAppUserAuth, Sessions } = container;
  await VgAppUserAuth.setActive(actorId, active);
  if (active === false) await Sessions.terminateByActorId(actorId);
  return true;
};

module.exports = {
  createAppUser,
  login,
  changePassword,
  resetPassword,
  revokeSessions,
  setActive
};
