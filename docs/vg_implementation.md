# VG App User Auth - Implementation

This document lists the key implementation points and modified core behavior.

## Tables

- `vg_field_key_auth`: One-to-one with `field_keys` by `actorId`. Stores username, password hash, phone, and active flag.
- `vg_settings`: Stores session TTL and cap values.
- `vg_app_user_login_attempts`: Stores login attempts for lockout enforcement.
- `vg_app_user_sessions`: Stores IP/device metadata (user agent, deviceId, comments) per active session (token FK to `sessions`).

## Core modules

- `server/lib/domain/vg-app-user-auth.js`: Orchestrates login, password change/reset, revoke, and activate/deactivate; emits vg audit events.
- `server/lib/model/query/vg-app-user-auth.js`: Data access for VG auth, settings lookup, and login attempt tracking.
- `server/lib/resources/vg-app-user-auth.js`: Exposes system settings endpoints for TTL and cap.

## File-by-file details

- `server/lib/domain/vg-app-user-auth.js`
  - `createAppUser()`: validates username/password/phone/name, creates field key without session, inserts `vg_field_key_auth`, emits audit.
  - `updateAppUser()`: updates display name and phone, emits audit.
  - `login()`: enforces lockout, verifies password, issues session with TTL, trims by cap, emits audit.
  - `changePassword()`: verifies old password, enforces policy, rotates sessions, emits audit.
  - `resetPassword()`: admin reset, enforces policy, rotates sessions, emits audit.
  - `revokeSessions()`: terminates sessions for actor (optionally current token), emits audit.
  - `setActive()`: toggles active flag, terminates sessions on deactivate, emits audit.
- `server/lib/model/query/vg-app-user-auth.js`
  - `getSessionTtlDays()` / `getSessionCap()`: read settings with defaults (3 days, cap 3).
  - `insertAuth()`, `updatePassword()`, `updatePhone()`, `setActive()`: CRUD for `vg_field_key_auth`.
  - `recordAttempt()` / `getLockStatus()`: login attempt tracking and lockout checks.
  - `recordSession()` / `getActiveSessionsByActorId()`: session metadata tracking and listing.
- `server/lib/resources/vg-app-user-auth.js`
  - Maps HTTP routes to the domain functions and enforces auth/permission checks.
- `server/lib/model/query/sessions.js`
  - Rejects sessions for deactivated app users (`vg_active=false`).
- `server/lib/model/query/field-keys.js`
  - Joins `vg_field_key_auth` so app-user responses include username/phone/active.

## Endpoint to handler mapping

- `POST /projects/:projectId/app-users/login` -> `vgAppUserAuth.login()`
- `POST /projects/:projectId/app-users/:id/password/change` -> `vgAppUserAuth.changePassword()`
- `POST /projects/:projectId/app-users/:id/password/reset` -> `vgAppUserAuth.resetPassword()`
- `POST /projects/:projectId/app-users/:id/revoke` -> `vgAppUserAuth.revokeSessions()` (self)
- `POST /projects/:projectId/app-users/:id/revoke-admin` -> `vgAppUserAuth.setActive(false)`
- `GET /projects/:projectId/app-users/:id/sessions` -> `vgAppUserAuth.listSessions()`
- `POST /projects/:projectId/app-users/:id/active` -> `vgAppUserAuth.setActive(active)`
- `GET /system/settings` -> `VgAppUserAuth.getSessionTtlDays()` + `getSessionCap()`
- `PUT /system/settings` -> `VgAppUserAuth.upsertSetting()`

## Modified upstream behavior

- `server/lib/model/query/sessions.js`: Enforces `vg_active` for app-user sessions.
- `server/lib/model/query/field-keys.js`: Joins `vg_field_key_auth` data into app-user responses.

## Session handling

- Session TTL is loaded from `vg_settings` (`vg_app_user_session_ttl_days`) when issuing tokens.
- No sliding refresh is applied; expiry is fixed at issuance.

## Audit events

VG emits vg-prefixed actions for creation, login success/failure, password change/reset, session revocation, and activation/deactivation.

## Migrations

- `server/docs/sql/vg_app_user_auth.sql`: Creates VG tables and seeds defaults (TTL 3, cap 3).

## Rate limiting and lockouts

- Login attempts are recorded in `vg_app_user_login_attempts` for username+IP lockouts.
- Lockouts are enforced in `server/lib/domain/vg-app-user-auth.js` using `getLockStatus()` from `server/lib/model/query/vg-app-user-auth.js`.

## Operational command (Docker)

Apply the schema migration in a local Docker setup:

```sh
docker exec -i central-postgres14-1 psql -U odk -d odk < docs/sql/vg_app_user_auth.sql
```
