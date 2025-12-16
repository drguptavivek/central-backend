# VG app-user auth: test scenarios and status

Key scenarios covered for the vg app-user auth / short-lived token work.

| Scenario | Coverage | Status | Notes | Command |
| --- | --- | --- | --- | --- |
| Create app user does not mint long-lived session; login issues short token with projectId; session TTL ≈ 3 days | `test/integration/api/vg-app-user-auth.js` (first test) | ✅ Pass | Validates no session on create, login returns token+projectId, session expiry ~72h | `NODE_CONFIG_ENV=test BCRYPT=insecure npx mocha --recursive test/integration/api/vg-app-user-auth.js` |
| Lockout after 5 failed attempts per username+IP with 10-min block | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | Confirms 6th attempt rejected after 5 failures | same as above |
| Lockout lifts after window expires | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | Aging attempts beyond lock window allows login | same as above |
| Max 3 active sessions per app user | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | Fourth login prunes oldest token; capped at 3 | same as above |
| Password change invalidates prior sessions and allows new login with new password | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | Old token rejected; new token issued | same as above |
| Admin reset + deactivate blocks login and revokes sessions; reactivate check | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | Ensures reset forces re-login; deactivate blocks auth; revoke-admin fails on old token | same as above |
| Username normalization on create; mixed-case login succeeds | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | Stores normalized username; login accepts mixed case/whitespace | same as above |
| Duplicate username rejected (unique constraint) | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | Second create returns 409 | same as above |
| Invalid passwords and blank usernames rejected on create | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | Password policy enforced; whitespace-only username rejected | same as above |
| App user cannot change/reset/deactivate another app user | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | RBAC enforcement: token-bound actor cannot operate on other app users | same as above |
| App user cannot change admin/user password via `/users/:id/password` | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | App-user token gets 403 on user password route | same as above |
| Expired tokens are rejected | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | Manual expiry in DB causes authenticated action to fail | same as above |
| Deactivated app user cannot log in or reuse prior token | `test/integration/api/vg-app-user-auth.js` | ✅ Pass | Admin deactivation blocks login and invalidates existing token | same as above |
| Password policy enforcement (length/upper/lower/digit/special) | `test/unit/util/vg-password.js` | ✅ Pass | Unit-level policy checks | `NODE_CONFIG_ENV=test BCRYPT=insecure npx mocha test/unit/util/vg-password.js` |
| Password policy: rejects too short | `test/unit/util/vg-password.js` | ✅ Pass | Rejects passwords shorter than policy | same as above |
| Password policy: requires special char | `test/unit/util/vg-password.js` | ✅ Pass | Rejects missing special characters | same as above |
| Password policy: requires uppercase | `test/unit/util/vg-password.js` | ✅ Pass | Rejects missing uppercase letter | same as above |
| Password policy: requires lowercase | `test/unit/util/vg-password.js` | ✅ Pass | Rejects missing lowercase letter | same as above |
| Password policy: requires digit | `test/unit/util/vg-password.js` | ✅ Pass | Rejects missing digit | same as above |

Not yet run in this session:
- ☐ Broader regression suites (full integration/unit matrix)
- ☐ Manual/automated TTL expiry verification beyond ~72h approximation
