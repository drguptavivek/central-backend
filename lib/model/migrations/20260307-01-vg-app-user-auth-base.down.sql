BEGIN;

DROP TABLE IF EXISTS vg_app_user_telemetry;
DROP TABLE IF EXISTS vg_app_user_sessions;
DROP TABLE IF EXISTS vg_app_user_lockouts;
DROP TABLE IF EXISTS vg_app_user_login_attempts;
DROP TABLE IF EXISTS vg_project_settings;
DROP TABLE IF EXISTS vg_settings;
DROP TABLE IF EXISTS vg_field_key_auth;

COMMIT;
