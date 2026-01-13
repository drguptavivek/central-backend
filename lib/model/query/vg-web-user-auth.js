// Copyright 2024 ODK Central Developers
// See the NOTICE file at the top-level directory of this distribution and at
// https://github.com/getodk/central-backend/blob/master/NOTICE.
// This file is part of ODK Central. It is subject to the license terms in
// the LICENSE file found in the top-level directory of this distribution and at
// https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
// including this file, may be copied, modified, propagated, or distributed
// except according to the terms contained in the LICENSE file.

// VG Web User Authentication Module
// Provides IP-based rate limiting and enhanced security for web user logins

const { sql } = require('slonik');
const Problem = require('../../util/problem');

const IP_MAX_FAILURES = 20;
const IP_WINDOW_MINUTES = 15;
const IP_LOCK_DURATION_MINUTES = 30;

/**
 * Gets the total number of failed login attempts from an IP within a time window
 * @param {string|null} ip - IP address to check
 * @param {number} windowMinutes - Time window in minutes
 * @returns {Function} Function that takes container and returns count
 */
const getTotalWebLoginFailuresFromIp = (ip, windowMinutes) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT count(*)::int AS count
    FROM audits
    WHERE action = 'user.session.create.failure'
      AND ${ip == null ? sql`(details->>'ip') IS NULL` : sql`details->>'ip'=${ip}`}
      AND "loggedAt" >= now() - (${windowMinutes} * interval '1 minute')
  `).then((opt) => opt.map((row) => row.count).orElse(0));

/**
 * Checks if an IP has a recent IP lockout within the duration
 * @param {string|null} ip - IP address to check
 * @param {number} durationMinutes - Lockout duration in minutes
 * @returns {Function} Function that takes container and returns locked status
 */
const hasRecentWebIpLockout = (ip, durationMinutes) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT COALESCE(
      max("loggedAt") > now() - (${durationMinutes} * interval '1 minute'),
      false
    ) AS locked
    FROM audits
    WHERE action = 'user.session.ip.lockout'
      AND ${ip == null ? sql`(details->>'ip') IS NULL` : sql`details->>'ip'=${ip}`}
  `).then((opt) => opt.map((row) => row.locked).orElse(false));

/**
 * Gets the timestamp of the latest IP lockout for an IP
 * @param {string|null} ip - IP address to check
 * @returns {Function} Function that takes container and returns lockout timestamp
 */
const getLatestWebIpLockoutAt = (ip) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT max("loggedAt") AS locked_at
    FROM audits
    WHERE action = 'user.session.ip.lockout'
      AND ${ip == null ? sql`(details->>'ip') IS NULL` : sql`details->>'ip'=${ip}`}
  `).then((opt) => opt.map((row) => row.locked_at).orElse(null));

/**
 * Checks if an IP address is currently locked out due to too many failed login attempts
 * Returns a Promise that throws a Problem if locked, otherwise resolves to false
 * @param {string|null} ip - IP address to check
 * @returns {Function} Function that takes container and returns Promise<boolean>
 */
const isIpLocked = (ip) => ({ maybeOne }) => {
  if (ip == null) return Promise.resolve(false);

  return getLatestWebIpLockoutAt(ip)({ maybeOne })
    .then((lockedAt) => {
      if (lockedAt == null) return false;
      const remainingMs = new Date(lockedAt).getTime() + (IP_LOCK_DURATION_MINUTES * 60 * 1000) - Date.now();
      if (remainingMs <= 0) return false;

      // IP is locked, throw error
      const error = new Problem(429.7, 'Too many login attempts from your location. Please try again later.', {
        retryAfterSeconds: Math.ceil(remainingMs / 1000)
      });
      throw error;
    });
};

/**
 * Records a failed login attempt and triggers IP lockout if threshold exceeded
 * @param {string|null} ip - IP address
 * @param {string|null} email - Email address (for logging purposes)
 * @param {Object} Audits - Audits service (for logging)
 * @returns {Function} Function that takes container and returns lockout status
 */
const recordFailureAndMaybeLockout = (ip, email, Audits) => ({ maybeOne }) => {
  const logFailure = () => {
    if (email == null) {
      return Audits.log(null, 'user.session.create.failure', null, {
        email: null,
        ip,
        userAgent: null
      });
    }
    return Audits.log(null, 'user.session.create.failure', null, {
      email,
      ip,
      userAgent: null
    });
  };

  if (email == null) return logFailure();

  return logFailure()
    .then(() => Promise.all([
      getTotalWebLoginFailuresFromIp(ip, IP_WINDOW_MINUTES)({ maybeOne }),
      hasRecentWebIpLockout(ip, IP_LOCK_DURATION_MINUTES)({ maybeOne })
    ]))
    .then(([ipCount, isLocked]) => {
      // Check IP lockout first (prevents username enumeration)
      // Lock when count EXCEEDS threshold, not when it reaches it
      // (allows 20 attempts, locks on 21st)
      if (!isLocked && ipCount > IP_MAX_FAILURES) {
        return Audits.log(null, 'user.session.ip.lockout', null, {
          ip,
          durationMinutes: IP_LOCK_DURATION_MINUTES
        }).then(() => ({
          ipLocked: true,
          ipRetryAfterSeconds: IP_LOCK_DURATION_MINUTES * 60
        }));
      }
      return { ipLocked: false };
    });
};

module.exports = {
  isIpLocked,
  recordFailureAndMaybeLockout,
  getTotalWebLoginFailuresFromIp,
  hasRecentWebIpLockout,
  getLatestWebIpLockoutAt,
  IP_MAX_FAILURES,
  IP_WINDOW_MINUTES,
  IP_LOCK_DURATION_MINUTES
};
