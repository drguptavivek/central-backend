BEGIN;

-- Auth data for field keys (one-to-one with field_keys).
CREATE TABLE IF NOT EXISTS vg_field_key_auth (
  "actorId" integer PRIMARY KEY REFERENCES field_keys("actorId") ON DELETE CASCADE,
  vg_username text NOT NULL,
  vg_password_hash text NOT NULL,
  vg_phone text NULL,
  vg_active boolean NOT NULL DEFAULT true,
  CONSTRAINT vg_field_key_auth_username_normalized CHECK (lower(btrim(vg_username)) = vg_username)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_vg_field_key_auth_username ON vg_field_key_auth (vg_username);
CREATE INDEX IF NOT EXISTS idx_vg_field_key_auth_active ON vg_field_key_auth (vg_active);

-- vg settings key/value.
CREATE TABLE IF NOT EXISTS vg_settings (
  id serial PRIMARY KEY,
  vg_key_name text NOT NULL UNIQUE,
  vg_key_value text NOT NULL
);
INSERT INTO vg_settings (vg_key_name, vg_key_value)
  VALUES ('vg_app_user_session_ttl_days', '3')
  ON CONFLICT (vg_key_name) DO NOTHING;
INSERT INTO vg_settings (vg_key_name, vg_key_value)
  VALUES ('vg_app_user_session_cap', '3')
  ON CONFLICT (vg_key_name) DO NOTHING;

-- Login attempt log for rate limiting/lockout.
CREATE TABLE IF NOT EXISTS vg_app_user_login_attempts (
  id bigserial PRIMARY KEY,
  username text NOT NULL,
  ip inet,
  succeeded boolean NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vg_login_attempts_user_createdat ON vg_app_user_login_attempts (username, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_vg_login_attempts_ip_createdat ON vg_app_user_login_attempts (ip, "createdAt" DESC);

-- Ensure admin/manager roles can update app users (displayName/phone).
UPDATE roles
SET verbs = coalesce(verbs, '[]'::jsonb) || '["field_key.update"]'::jsonb
WHERE system IN ('admin', 'manager');

COMMIT;
