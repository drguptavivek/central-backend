// Copyright 2017 ODK Central Developers
// See the NOTICE file at the top-level directory of this distribution and at
// https://github.com/getodk/central-backend/blob/master/NOTICE.
// This file is part of ODK Central. It is subject to the license terms in
// the LICENSE file found in the top-level directory of this distribution and at
// https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
// including this file, may be copied, modified, propagated, or distributed
// except according to the terms contained in the LICENSE file.

const { verifyPassword } = require('../util/crypto');
const Problem = require('../util/problem');
const { isBlank } = require('../util/util');
const { getOrReject } = require('../util/promise');
const { success } = require('../util/http');
const { SESSION_COOKIE, createUserSession } = require('../http/sessions');
const oidc = require('../util/oidc');
const { pick } = require('ramda');

module.exports = (service, endpoint, anonymousEndpoint) => {
  const MAX_FAILURES = 5;
  const WINDOW_MINUTES = 5;
  const LOCK_DURATION_MINUTES = 10;
  const normalizeEmail = (value) => (typeof value === 'string')
    ? value.trim().toLowerCase()
    : null;
  const normalizeIp = (value) => (typeof value === 'string' && value.trim() !== '')
    ? value.trim()
    : null;

  if (!oidc.isEnabled()) {
    service.post('/sessions', anonymousEndpoint(({ Audits, Users, Sessions, VgAppUserAuth }, { body, headers }, request) => {
      // TODO if we're planning to offer multiple authN methods, we should be looking for
      // any calls to verifyPassword(), and blocking them if that authN method is not
      // appropriate for the current user.
      //
      // It may be useful to re-use the sessions resources for other authN methods.

      const { email, password } = body;
      const authFailed = Problem.user.authenticationFailed();
      const normalizedEmail = normalizeEmail(email);
      const normalizedIp = normalizeIp(request.ip);
      const logFailedLogin = () => Audits.log(null, 'user.session.create.failure', null, {
        email: normalizedEmail,
        ip: normalizedIp,
        userAgent: request.get('user-agent') ?? null
      });
      const lockoutDurationMinutes = () =>
        VgAppUserAuth.getSettingValue('vg_web_user_lock_duration_minutes', LOCK_DURATION_MINUTES);
      const recordFailureAndMaybeLockout = () => {
        if (normalizedEmail == null) return logFailedLogin();
        return logFailedLogin()
          .then(() => Promise.all([
            Audits.getWebLoginFailureCount(normalizedEmail, normalizedIp, WINDOW_MINUTES),
            lockoutDurationMinutes()
          ]))
          .then(([count, durationMinutes]) =>
            Audits.hasRecentWebLoginLockout(normalizedEmail, normalizedIp, durationMinutes)
              .then((isLocked) => ({ count, isLocked, durationMinutes })))
          .then(({ count, isLocked, durationMinutes }) => {
            if (!isLocked && count >= MAX_FAILURES)
              return Audits.log(null, 'user.session.lockout', null, {
                email: normalizedEmail,
                ip: normalizedIp,
                durationMinutes
              });
            return null;
          });
      };
      const isLocked = () => (normalizedEmail == null)
        ? Promise.resolve(false)
        : lockoutDurationMinutes()
          .then((durationMinutes) =>
            Audits.hasRecentWebLoginLockout(normalizedEmail, normalizedIp, durationMinutes));

      if (isBlank(email) || isBlank(password))
        return Problem.user.missingParameters({ expected: [ 'email', 'password' ], got: { email, password } });

      const getUserAndHash = () => Users.getByEmail(email)
        .then((opt) => opt
          .map((user) => ({ user, hash: user.password }))
          .orElse(Users.getAnyPasswordHash().then((hash) => ({ user: null, hash }))));

      return isLocked()
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
            return recordFailureAndMaybeLockout().then(() => Promise.reject(problem));
          return Promise.reject(problem);
        });
    }));
  }

  service.get('/sessions/restore', endpoint((_, { auth }) =>
    auth.session
      .map(pick(['createdAt', 'expiresAt']))
      .orElse(Problem.user.notFound())));

  const logOut = (Sessions, auth, session) =>
    auth.canOrReject('session.end', session.actor)
      .then(() => Sessions.terminate(session))
      .then(() => (_, response) => {
        // revoke the cookies associated w the session, if the session was used to
        // terminate itself.
        // TODO: repetitive w above.
        if (session.token === auth.session.map((s) => s.token).orNull()) {
          response.cookie(SESSION_COOKIE, 'null', { path: '/', expires: new Date(0),
            httpOnly: true, secure: true, sameSite: 'strict' });
          response.cookie('__csrf', 'null', { expires: new Date(0),
            secure: true, sameSite: 'strict' });
        }

        return success;
      });

  service.delete('/sessions/current', endpoint(({ Sessions }, { auth }) =>
    auth.session.map(session => logOut(Sessions, auth, session))
      .orElse(Problem.user.notFound())));

  // here we always throw a 403 even if the token doesn't exist to prevent
  // information leakage.
  // TODO: but a timing attack still exists here. :(
  service.delete('/sessions/:token', endpoint(({ Sessions }, { auth, params }) =>
    Sessions.getByBearerToken(params.token)
      .then(getOrReject(Problem.user.insufficientRights()))
      .then(session => logOut(Sessions, auth, session))));
};
