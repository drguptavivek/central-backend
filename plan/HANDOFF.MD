## Current state (vg app-user auth)

- Repo: /Users/vivekgupta/workspace/ODK/central (workspace-write). Network restricted.
- Feature: vg app-user short tokens, session cap, audits implemented.
- DB config: `vg_settings` seeds include `vg_app_user_session_ttl_days=3`, `vg_app_user_session_cap=3`.
- Audits: vg.app_user.create/login.success/login.failure/password.change/password.reset/sessions.revoke/activate/deactivate all logged via Audits.log.
- Tests now green:
  - `NODE_CONFIG_ENV=test BCRYPT=insecure npx mocha --recursive test/integration/api/vg-app-user-auth.js`
  - `NODE_CONFIG_ENV=test BCRYPT=insecure npx mocha test/unit/util/vg-password.js`

## Recent edits

- Domain: added audit logging and session-cap enforcement; stricter username validation.
- Query: vg-app-user-auth joins actors to carry acteeId; Sessions.trimByActorId added.
- Docs/plan: updated API doc and plan files with session cap + audits; vg_tests.md table refreshed.

## Commands

- Run integration suite:
  `docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.dev.yml --profile central exec service sh -lc 'cd /usr/odk  && NODE_CONFIG_ENV=test BCRYPT=insecure npx mocha --recursive test/integration/api/vg-app-user-auth.js'`
- Run unit password policy:
  `docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.dev.yml --profile central exec service sh -lc 'cd /usr/odk &&  NODE_CONFIG_ENV=test BCRYPT=insecure npx mocha test/unit/util/vg-password.js'`

## Notes

- Session cap is configurable via DB: `INSERT INTO vg_settings (vg_key_name, vg_key_value) VALUES ('vg_app_user_session_cap','2') ON CONFLICT (vg_key_name) DO UPDATE SET vg_key_value='2';`
- Tokens stored in `sessions`; logins trim older sessions beyond cap.
