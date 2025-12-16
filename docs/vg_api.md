# VG App-User Auth API

Short-lived, password-based auth for Collect-style app users tied to projects. Tokens are bearer-only (no cookies) and expire based on `vg_app_user_session_ttl_days` (default 3 days) stored in `vg_settings`.

## Password policy
- Minimum 10 characters
- At least one uppercase, one lowercase, one digit, one special (`~!@#$%^&*()_+-=,.`)
- Rejects anything that does not meet all criteria

## Endpoints
- `POST /projects/:projectId/app-users`
  - Admin/manager only. Payload `{ username, password, fullName, phone?, active? }`.
  - Creates `field_keys` + `vg_field_key_auth`; does **not** mint a long-lived session. Response is the app-user record (no token).
- `POST /projects/:projectId/app-users/login`
  - Anonymous. Payload `{ username, password }` using normalized lowercase usernames.
  - On success returns `{ token, projectId }` with expiry set from `vg_app_user_session_ttl_days`. Cookies ignored.
  - On failure returns `401.2 authenticationFailed` (generic message).
  - Lockout: 5 failed attempts in 5 minutes per `username+IP` → 10-minute lock. Attempts are logged in `vg_app_user_login_attempts` with success/failure.
- `POST /projects/:projectId/app-users/:id/password/change`
  - Authenticated app user (Bearer token) only. Payload `{ oldPassword, newPassword }` respecting policy.
  - Verifies old password, updates hash, and terminates all sessions for that actor.
- `POST /projects/:projectId/app-users/:id/password/reset`
  - Admin/manager only. Payload `{ newPassword }` respecting policy. Terminates all sessions for that actor.
- `POST /projects/:projectId/app-users/:id/revoke`
  - Authenticated app user can revoke all of their sessions (including current).
- `POST /projects/:projectId/app-users/:id/revoke-admin`
  - Admin/manager can revoke all sessions for the target app user.
- `POST /projects/:projectId/app-users/:id/active`
  - Admin/manager only. Payload `{ active: boolean }`. Setting `false` deactivates and terminates sessions; deactivated users cannot log in or be authenticated.

## Expected behavior
- Sessions remain valid only while `vg_field_key_auth.vg_active` is true and until `expiresAt` (no sliding refresh).
- All auth checks use bearer headers; cookies are ignored on these routes to minimize CSRF surface.
- Audit events for creation, password operations, revocation, activation, and login success/failure should be emitted with vg-prefixed action identifiers.
