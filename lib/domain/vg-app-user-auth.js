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

const logAudit = async (container, actor, action, actee = null, details = {}) => {
  if (!container?.Audits) return;
  const resolvedActor = (actor && actor.id != null) ? actor
    : (actor != null ? { id: actor } : container.context?.auth?.actor.orNull?.() || null);
  const resolvedActee = (actee && actee.acteeId != null) ? { acteeId: actee.acteeId }
    : (actee != null ? { acteeId: actee } : null);
  await container.Audits.log(resolvedActor, action, resolvedActee, details);
};

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
    throw Problem.user.passwordWeak();
};

const validateUsername = (username, payload) => {
  if (typeof username !== 'string') throw Problem.user.missingParameters({ expected: ['username'], got: payload });
  const normalized = username.trim().toLowerCase();
  if (normalized === '') throw Problem.user.missingParameters({ expected: ['username'], got: payload });
  if (NON_ASCII.test(normalized) || !USERNAME_PATTERN.test(normalized))
    throw Problem.user.invalidEntity({ reason: 'Username contains invalid characters.' });
  return normalized;
};

const validatePhone = (phone, payload) => {
  if (phone == null || phone === '') return null;
  if (typeof phone !== 'string') throw Problem.user.missingParameters({ expected: ['phone'], got: payload });
  const trimmed = phone.trim();
  if (trimmed.length > 25) throw Problem.user.invalidEntity({ reason: 'Phone number too long.' });
  return trimmed;
};
const validateDisplayName = (fullName, payload) => {
  if (typeof fullName !== 'string') throw Problem.user.missingParameters({ expected: ['fullName'], got: payload });
  const trimmed = fullName.trim();
  if (trimmed === '') throw Problem.user.missingParameters({ expected: ['fullName'], got: payload });
  return trimmed;
};

const createAppUser = async (container, project, payload, createdBy) => {
  const { FieldKeys, VgAppUserAuth } = container;
  const { username, password, phone, fullName, active = true } = payload;
  const cleanedUsername = validateUsername(username, payload);
  const cleanedPhone = validatePhone(phone, payload);
  const cleanedName = validateDisplayName(fullName, payload);
  ensurePasswordPolicy(password);
  const hash = await hashPassword(password);
  // Create field key without session, then attach vg auth.
  const fk = await FieldKeys.createWithoutSession(
    FieldKey.fromApi({ displayName: cleanedName })
      .with({ createdBy: createdBy ?? null }),
    project
  );
  await VgAppUserAuth.insertAuth({ actorId: fk.actor.id, username: cleanedUsername, passwordHash: hash, phone: cleanedPhone, active });
  await logAudit(container, createdBy, 'vg.app_user.create', fk.actor, { username: cleanedUsername, active, projectId: project.id });
  return fk;
};

const updateAppUser = async (container, actorId, projectId, payload) => {
  const { Actors, VgAppUserAuth } = container;
  const { fullName, phone } = payload;
  const updates = {};
  if (fullName != null) updates.fullName = validateDisplayName(fullName, payload);
  if (phone !== undefined) updates.phone = validatePhone(phone, payload);

  if (updates.fullName != null)
    await Actors.updateDisplayName(actorId, updates.fullName);
  if (updates.phone !== undefined)
    await VgAppUserAuth.updatePhone(actorId, updates.phone);

  await logAudit(container, container.context?.auth?.actor.orNull?.()?.id ?? null, 'vg.app_user.update', actorId, { projectId, phone: updates.phone, fullName: updates.fullName });
  return true;
};

const login = async (container, { username, password, ip }) => {
  const { VgAppUserAuth, Sessions } = container;
  const locked = await getLock(VgAppUserAuth, username, ip);
  if (locked) {
    await logAudit(container, null, 'vg.app_user.login.failure', null, { username, ip, reason: 'locked' });
    throw Problem.user.authenticationFailed();
  }

  const auth = await VgAppUserAuth.getByUsername(username);
  if (auth.isEmpty() || auth.get().vg_active !== true) {
    await VgAppUserAuth.recordAttempt(username, ip, false);
    await logAudit(container, null, 'vg.app_user.login.failure', null, { username, ip, reason: 'inactive_or_missing' });
    throw Problem.user.authenticationFailed();
  }
  const record = auth.get();
  const projectId = record.aux?.fieldKey?.projectId ?? record.projectId;
  const actor = record.aux?.actor?.orNull?.() ?? record.aux?.actor ?? null;
  const ok = await verifyPassword(password, record.vg_password_hash);
  if (!ok) {
    await VgAppUserAuth.recordAttempt(username, ip, false);
    await logAudit(container, actor ?? record.actorId, 'vg.app_user.login.failure', actor ?? record.actorId, { username, ip, reason: 'bad_password' });
    throw Problem.user.authenticationFailed();
  }
  await VgAppUserAuth.recordAttempt(username, ip, true);
  const ttlDays = await VgAppUserAuth.getSessionTtlDays();
  const sessionCap = await VgAppUserAuth.getSessionCap();
  const expiresAt = new Date(Date.now() + Number(ttlDays) * 24 * 60 * 60 * 1000);
  const session = await Sessions.create({ id: record.actorId }, expiresAt);
  await Sessions.trimByActorId(record.actorId, sessionCap);
  await logAudit(container, actor ?? record.actorId, 'vg.app_user.login.success', actor ?? record.actorId, { username, ip, projectId });
  return { id: record.actorId, token: session.token, projectId, expiresAt: session.expiresAt };
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
  const actor = record.aux?.actor?.orNull?.() ?? record.aux?.actor ?? null;
  await logAudit(container, actor ?? actorId, 'vg.app_user.password.change', actor ?? actorId, { projectId: record.aux?.fieldKey?.projectId ?? record.projectId, username: record.vg_username });
  return true;
};

const resetPassword = async (container, actorId, { newPassword }) => {
  const { VgAppUserAuth, Sessions } = container;
  const auth = await VgAppUserAuth.getByActorId(actorId);
  const record = auth.isDefined() ? auth.get() : null;
  const actor = record?.aux?.actor?.orNull?.() ?? record?.aux?.actor ?? null;
  ensurePasswordPolicy(newPassword);
  const hash = await hashPassword(newPassword);
  await VgAppUserAuth.updatePassword(actorId, hash);
  await Sessions.terminateByActorId(actorId);
  await logAudit(container, container.context?.auth?.actor.orNull?.()?.id ?? null, 'vg.app_user.password.reset', actor ?? actorId, { projectId: record?.aux?.fieldKey?.projectId ?? record?.projectId, username: record?.vg_username });
  return true;
};

const revokeSessions = async (container, actorId, currentToken) => {
  const { Sessions, VgAppUserAuth } = container;
  const auth = VgAppUserAuth ? await VgAppUserAuth.getByActorId(actorId) : null;
  const record = auth && auth.isDefined() ? auth.get() : null;
  const actor = record?.aux?.actor?.orNull?.() ?? record?.aux?.actor ?? null;
  await Sessions.terminateByActorId(actorId, currentToken);
  await logAudit(container, container.context?.auth?.actor.orNull?.()?.id ?? actorId, 'vg.app_user.sessions.revoke', actor ?? actorId, { username: record?.vg_username });
  return true;
};

const setActive = async (container, actorId, active) => {
  const { VgAppUserAuth, Sessions } = container;
  const auth = await VgAppUserAuth.getByActorId(actorId);
  const record = auth.isDefined() ? auth.get() : null;
  const actor = record?.aux?.actor?.orNull?.() ?? record?.aux?.actor ?? null;
  await VgAppUserAuth.setActive(actorId, active);
  if (active === false) {
    await Sessions.terminateByActorId(actorId);
    await logAudit(container, container.context?.auth?.actor.orNull?.()?.id ?? actorId, 'vg.app_user.sessions.revoke', actor ?? actorId, { username: record?.vg_username });
  }
  await logAudit(container, container.context?.auth?.actor.orNull?.()?.id ?? null, active ? 'vg.app_user.activate' : 'vg.app_user.deactivate', actor ?? actorId, { username: record?.vg_username, projectId: record?.aux?.fieldKey?.projectId ?? record?.projectId, active });
  return true;
};

module.exports = {
  createAppUser,
  updateAppUser,
  login,
  changePassword,
  resetPassword,
  revokeSessions,
  setActive
};
