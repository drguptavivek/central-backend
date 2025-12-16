# CI checklist for vg app-user login + short tokens

Purpose: track implementation steps for the vg_* app-user login, password policy, and short-lived session work so it remains mergeable against upstream.

## Migration and schema
- [x] Apply SQL migration at plan/sql/vg_app_user_auth.sql (creates vg_field_key_auth, vg_settings seeded with vg_app_user_session_ttl_days=3, vg_app_user_login_attempts).

## Model/query layer
- [ ] Extend FieldKey frame with vg_* fields.
- [ ] Add vg-specific field key queries (create with password, set password, set active, get by vg_username).
- [ ] Add vg_app_user_auth query helpers for lockout checks and recording attempts.
- [ ] Ensure Sessions.create/bearer lookup respects vg_active and uses config TTL.

## Domain/helpers
- [ ] Implement vg_app_user_password policy helper (10 chars, upper/lower/digit/special).
- [ ] Implement vg_app_user_auth orchestration (login, change/reset password, revoke, deactivate).
- [ ] Define vg_* audit action identifiers and emit events.

## HTTP/resources
- [ ] Wire new vg app-user auth routes (login, change, reset, self revoke, admin revoke, deactivate/reactivate).
- [ ] Adjust app-user create/update to require vg_username/password and map payload to vg_* columns.
- [ ] Ensure login routes ignore cookies; use bearer/header-only to avoid CSRF; CSRF tokens if cookies ever used for admin UI.

## Rate limiting and lockout
- [ ] Enforce 5 failed attempts in 5 minutes -> 10-minute lockout, keyed by vg_username+IP.
- [ ] Persist attempts to vg_app_user_login_attempts; surface audit/telemetry.

## Testing
- [ ] Integration tests for create/login/lockout/change/reset/revoke/deactivate and session TTL.
- [ ] Unit tests for password policy and lockout calculator.

## Deployment/configuration
- [ ] Document new config key vg_app_user_session_ttl_days and defaults.
- [ ] Document schema changes and rollout order (migrate before deploy). Reference plan/sql/vg_app_user_auth.sql for the migration.

## Post-deploy verification
- [ ] Verify new app-user creation, login, and token issuance with 3-day expiry.
- [ ] Verify lockout behavior and reset path.
- [ ] Verify deactivate blocks auth and revokes sessions.
