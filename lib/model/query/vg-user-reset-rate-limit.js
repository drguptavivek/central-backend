// Copyright 2026 ODK Central Developers
// See the NOTICE file at the top-level directory of this distribution and at
// https://github.com/getodk/central-backend/blob/master/NOTICE.
// This file is part of ODK Central. It is subject to the license terms in
// the LICENSE file found in the top-level directory of this distribution and at
// https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
// including this file, may be copied, modified, propagated, or distributed
// except according to the terms contained in the LICENSE file.

// VG password reset initiate rate limiting
// Uses audit log to track attempts and lockouts

const { sql } = require('slonik');
const Problem = require('../../util/problem');

const RESET_IP_MAX_FAILURES = 3;
const RESET_IP_WINDOW_MINUTES = 10;
const RESET_IP_LOCK_DURATION_MINUTES = 30;

const RESET_EMAIL_MAX_FAILURES = 3;
const RESET_EMAIL_WINDOW_MINUTES = 30;
const RESET_EMAIL_LOCK_DURATION_MINUTES = 60;

const getResetAttemptsByIp = (ip, windowMinutes) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT count(*)::int AS count
    FROM audits
    WHERE action = 'user.reset.initiate'
      AND ${ip == null ? sql`(details->>'ip') IS NULL` : sql`details->>'ip'=${ip}`}
      AND "loggedAt" >= now() - (${windowMinutes} * interval '1 minute')
  `).then((opt) => opt.map((row) => row.count).orElse(0));

const getResetAttemptsByEmail = (email, windowMinutes) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT count(*)::int AS count
    FROM audits
    WHERE action = 'user.reset.initiate'
      AND ${email == null ? sql`(details->>'email') IS NULL` : sql`details->>'email'=${email}`}
      AND "loggedAt" >= now() - (${windowMinutes} * interval '1 minute')
  `).then((opt) => opt.map((row) => row.count).orElse(0));

const getLatestResetIpLockoutAt = (ip) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT max("loggedAt") AS locked_at
    FROM audits
    WHERE action = 'user.reset.ip.lockout'
      AND ${ip == null ? sql`(details->>'ip') IS NULL` : sql`details->>'ip'=${ip}`}
  `).then((opt) => opt.map((row) => row.locked_at).orElse(null));

const getLatestResetEmailLockoutAt = (email) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT max("loggedAt") AS locked_at
    FROM audits
    WHERE action = 'user.reset.email.lockout'
      AND ${email == null ? sql`(details->>'email') IS NULL` : sql`details->>'email'=${email}`}
  `).then((opt) => opt.map((row) => row.locked_at).orElse(null));

const createLockoutProblem = () =>
  new Problem(429.8, 'Too many password reset attempts. Please try again later.');

const assertNotIpLocked = (ip) => ({ maybeOne }) =>
  getLatestResetIpLockoutAt(ip)({ maybeOne })
    .then((lockedAt) => {
      if (lockedAt == null) return false;
      const remainingMs = new Date(lockedAt).getTime()
        + (RESET_IP_LOCK_DURATION_MINUTES * 60 * 1000) - Date.now();
      if (remainingMs <= 0) return false;
      throw createLockoutProblem();
    });

const assertNotEmailLocked = (email) => ({ maybeOne }) =>
  getLatestResetEmailLockoutAt(email)({ maybeOne })
    .then((lockedAt) => {
      if (lockedAt == null) return false;
      const remainingMs = new Date(lockedAt).getTime()
        + (RESET_EMAIL_LOCK_DURATION_MINUTES * 60 * 1000) - Date.now();
      if (remainingMs <= 0) return false;
      throw createLockoutProblem();
    });

const maybeLockoutIp = (ip, Audits) => ({ maybeOne }) =>
  getResetAttemptsByIp(ip, RESET_IP_WINDOW_MINUTES)({ maybeOne })
    .then((count) => {
      if (count > RESET_IP_MAX_FAILURES) {
        return Audits.log(null, 'user.reset.ip.lockout', null, {
          ip,
          durationMinutes: RESET_IP_LOCK_DURATION_MINUTES
        }).then(() => {
          throw createLockoutProblem();
        });
      }
      return false;
    });

const maybeLockoutEmail = (email, Audits) => ({ maybeOne }) =>
  getResetAttemptsByEmail(email, RESET_EMAIL_WINDOW_MINUTES)({ maybeOne })
    .then((count) => {
      if (count > RESET_EMAIL_MAX_FAILURES) {
        return Audits.log(null, 'user.reset.email.lockout', null, {
          email,
          durationMinutes: RESET_EMAIL_LOCK_DURATION_MINUTES
        }).then(() => {
          throw createLockoutProblem();
        });
      }
      return false;
    });

const checkAndMaybeLockout = (ip, email, Audits) => ({ maybeOne }) =>
  assertNotIpLocked(ip)({ maybeOne })
    .then(() => assertNotEmailLocked(email)({ maybeOne }))
    .then(() => maybeLockoutIp(ip, Audits)({ maybeOne }))
    .then(() => maybeLockoutEmail(email, Audits)({ maybeOne }));

module.exports = {
  checkAndMaybeLockout,
  RESET_IP_MAX_FAILURES,
  RESET_IP_WINDOW_MINUTES,
  RESET_IP_LOCK_DURATION_MINUTES,
  RESET_EMAIL_MAX_FAILURES,
  RESET_EMAIL_WINDOW_MINUTES,
  RESET_EMAIL_LOCK_DURATION_MINUTES
};
