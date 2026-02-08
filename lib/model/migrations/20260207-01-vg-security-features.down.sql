-- Rollback VG security features

-- IP Whitelist
DROP TABLE IF EXISTS vg_user_ip_whitelist;

-- TOTP 2FA
DROP TABLE IF EXISTS vg_web_user_totp_attempts;
DROP TABLE IF EXISTS vg_web_user_totp_backup_codes;
DROP TABLE IF EXISTS vg_web_user_totp;

-- App User Auth
DROP TABLE IF EXISTS vg_app_user_telemetry;
DROP TABLE IF EXISTS vg_app_user_sessions;
DROP TABLE IF EXISTS vg_app_user_lockouts;
DROP TABLE IF EXISTS vg_app_user_login_attempts;
DROP TABLE IF EXISTS vg_project_settings;
DROP TABLE IF EXISTS vg_settings;
DROP TABLE IF EXISTS vg_field_key_auth;

-- Session Column (cannot easily undo ALTER TABLE ADD COLUMN without potentially losing data, 
-- but for test cleanup this is usually sufficient or the whole table is dropped by other migrations)
-- ALTER TABLE sessions DROP COLUMN IF EXISTS totp_verified;
