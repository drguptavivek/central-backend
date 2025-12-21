# VG App User Auth - Settings

VG stores session configuration in `vg_settings`.

## Keys and defaults

- `vg_app_user_session_ttl_days` (default: 3)
- `vg_app_user_session_cap` (default: 3)

Defaults are seeded by `server/docs/sql/vg_app_user_auth.sql`.

## Where settings apply

- TTL controls how long a bearer token remains valid.
- Cap controls how many active sessions an app user can have.
- When the cap is exceeded, older sessions are revoked on login.

## Update paths

- API: `GET /system/settings` returns current values; `PUT /system/settings` updates them.
- DB: update `vg_settings` directly if needed.

## Validation

- Values are stored as strings but parsed as numbers server-side.
- Use positive integers for both TTL (days) and cap (sessions).
- DB constraint enforces positive integer values for these keys.

## Access control

- `GET /system/settings` requires `config.read`.
- `PUT /system/settings` requires `config.set`.
