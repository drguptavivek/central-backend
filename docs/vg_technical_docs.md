# VG Technical Docs (Server)

This document lists key VG-related server files and their purpose or modified purpose.

## Schema and data

- `server/plan/sql/vg_app_user_auth.sql` - Creates VG tables (`vg_field_key_auth`, `vg_settings`, `vg_app_user_login_attempts`) and seeds defaults (TTL 3 days, cap 3).
- `server/plan/app_user_login_short_token_system.md` - Design notes for the short-token app-user system and schema.

## Domain and resources

- `server/lib/domain/vg-app-user-auth.js` - Core orchestration for app-user login, password change/reset, revoke, and activate/deactivate; emits vg audit events.
- `server/lib/resources/vg-app-user-auth.js` - HTTP resource for VG settings (session TTL/cap) and related endpoints.

## Queries and models

- `server/lib/model/query/vg-app-user-auth.js` - VG auth data access (username lookup, password updates, session TTL/cap lookup, login attempt tracking).
- `server/lib/model/query/sessions.js` - Modified to enforce `vg_active` for app-user sessions.
- `server/lib/model/query/field-keys.js` - Modified to join `vg_field_key_auth` fields into app-user responses.

## Tests and fixtures

- `server/test/integration/api/vg-app-user-auth.js` - Integration tests for login, password rules, TTL/cap enforcement, and lockouts.
- `server/test/integration/fixtures/03-vg-app-user-auth.js` - Test fixture to create VG tables and seed defaults.

## Documentation

- `server/docs/vg_api.md` - API behavior and endpoint details for VG app-user auth.
- `server/docs/vg_core_server_edits.md` - Log of edits to upstream core files.
- `server/docs/vg_tests.md` - VG-focused test coverage and status.

## Planning and checklists

- `server/plan/vg_ci_checklist_app_user_login.md` - Implementation checklist and merge notes for VG features.
- `server/plan/cmds.md` - Common commands for applying VG migrations and running tests.
