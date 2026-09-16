// Domain logic for VG web-user authentication and password reset flows.
const { verifyPassword } = require('../util/crypto');
const Problem = require('../util/problem');
const { isBlank } = require('../util/util');
const { resolve } = require('../util/promise');
const { isTrue, success } = require('../util/http');
const { createUserSession } = require('../http/sessions');
const { User } = require('../model/frames');

const MAX_FAILURES = 5;
const WINDOW_MINUTES = 5;
const LOCK_DURATION_MINUTES = 10;

const normalizeEmail = (value) => (typeof value === 'string'
  ? value.trim().toLowerCase()
  : null);
const normalizeIp = (value) => (typeof value === 'string' && value.trim() !== ''
  ? value.trim()
  : null);

const login = async ({ Audits, Users, Sessions, VgAppUserAuth, VgWebUserAuth }, { body, headers }, request) => {
  const { email, password } = body;
  const authFailed = Problem.user.authenticationFailed();
  const normalizedEmail = normalizeEmail(email);
  // The header can contain multiple IPs; use the first (original client).
  const forwardedFor = request.get('X-Forwarded-For');
  const normalizedIp = normalizeIp(forwardedFor ? forwardedFor.split(',')[0].trim() : request.ip);
  const lockoutDurationMinutes = () =>
    VgAppUserAuth.getSettingValue('vg_web_user_lock_duration_minutes', LOCK_DURATION_MINUTES);
  const lockoutError = (retryAfterSeconds) => {
    const error = Problem.user.authenticationFailed();
    error.retryAfterSeconds = retryAfterSeconds;
    error.loginAttemptsRemaining = 0;
    return error;
  };
  const createIpLockoutError = (retryAfterSeconds) => new Problem(429.7,
    'Too many login attempts from your location. Please try again later.', { retryAfterSeconds });
  const recordFailureAndMaybeLockout = () =>
    VgWebUserAuth.recordFailureAndMaybeLockout(
      normalizedIp,
      normalizedEmail,
      Audits,
      request.get('user-agent') ?? null
    )
      .then((ipResult) => {
        if (ipResult.ipLocked)
          throw createIpLockoutError(ipResult.ipRetryAfterSeconds);
        return Promise.all([
          VgWebUserAuth.getWebLoginFailureCount(normalizedEmail, normalizedIp, WINDOW_MINUTES),
          lockoutDurationMinutes()
        ])
          .then(([count, durationMinutes]) =>
            VgWebUserAuth.hasRecentWebLoginLockout(normalizedEmail, normalizedIp, durationMinutes)
              .then((isLocked) => ({ count, isLocked, durationMinutes })))
          .then(({ count, isLocked, durationMinutes }) => {
            const attemptsRemaining = Math.max(MAX_FAILURES - count, 0);
            if (!isLocked && count >= MAX_FAILURES)
              return Audits.log(null, 'user.session.lockout', null, {
                email: normalizedEmail,
                ip: normalizedIp,
                durationMinutes
              }).then(() => ({ attemptsRemaining: 0 }));
            return { attemptsRemaining };
          });
      });
  const isLocked = () => (normalizedEmail == null
    ? Promise.resolve(false)
    : lockoutDurationMinutes()
      .then((durationMinutes) =>
        VgWebUserAuth.getLatestWebLoginLockoutAt(normalizedEmail, normalizedIp)
          .then((lockedAt) => {
            if (lockedAt == null) return false;
            const remainingMs = new Date(lockedAt).getTime() + (durationMinutes * 60 * 1000) - Date.now();
            if (remainingMs <= 0) return false;
            throw lockoutError(Math.ceil(remainingMs / 1000));
          })));

  if (isBlank(email) || isBlank(password))
    return Problem.user.missingParameters({ expected: [ 'email', 'password' ], got: { email, password } });

  const getUserAndHash = () => Users.getByEmail(email)
    .then((opt) => opt
      .map((user) => ({ user, hash: user.password }))
      .orElse(VgWebUserAuth.getAnyPasswordHash().then((hash) => ({ user: null, hash }))));

  return VgWebUserAuth.isIpLocked(normalizedIp)
    .then(() => isLocked())
    .then((locked) => {
      if (locked) throw authFailed;
      return getUserAndHash();
    })
    .then(({ user, hash }) => verifyPassword(password, hash)
      .then((verified) => {
        if (user == null || verified !== true) throw authFailed;
        return createUserSession({ Audits, Sessions, Users }, headers, user);
      }))
    .catch((problem) => {
      if (problem?.problemCode === authFailed.problemCode)
        return recordFailureAndMaybeLockout()
          .then((details) => {
            if (details?.attemptsRemaining != null) {
              const loginProblem = problem;
              loginProblem.loginAttemptsRemaining = details.attemptsRemaining;
            }
            return Promise.reject(problem);
          });
      return Promise.reject(problem);
    });
};

const initiateReset = ({ Users, mail, Audits, VgUserResetRateLimit }, { auth, body, query }, request) => {
  if (!body.email) return Problem.user.missingParameter({ field: 'email' });

  const normalizedEmail = normalizeEmail(body.email);
  const forwardedFor = request.get('X-Forwarded-For');
  const normalizedIp = normalizeIp(forwardedFor ? forwardedFor.split(',')[0].trim() : request.ip);
  const userAgent = request.get('user-agent') ?? null;

  return Audits.log(null, 'user.reset.initiate', null, {
    email: normalizedEmail,
    ip: normalizedIp,
    userAgent
  })
    .then(() => VgUserResetRateLimit.checkAndMaybeLockout(normalizedIp, normalizedEmail, Audits))
    .then(() => Users.getByEmail(normalizedEmail))
    .then((maybeUser) => maybeUser
      .map((user) => (isTrue(query.invalidate)
        ? auth.canOrReject('user.password.invalidate', user.actor)
          .then(() => Users.invalidatePassword(user))
        : resolve(user))
        .then(() => Users.provisionPasswordResetToken(user)
          .then((token) => mail(normalizedEmail, 'accountReset', { token }))))
      .orElseGet(() => (isTrue(query.invalidate)
        ? auth.canOrReject('user.password.invalidate', User.species)
        : resolve())
        .then(() => Users.emailEverExisted(normalizedEmail)
          .then((existed) => (existed === true
            ? mail(normalizedEmail, 'accountResetDeleted')
            : resolve()))))
      .then(success));
};

module.exports = { login, initiateReset };
