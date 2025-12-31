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
-- Ensure one row per actorId to avoid DataIntegrityError on maybeOne lookups.
CREATE UNIQUE INDEX IF NOT EXISTS idx_vg_field_key_auth_actorId ON vg_field_key_auth ("actorId");

-- vg settings key/value.
CREATE TABLE IF NOT EXISTS vg_settings (
  id serial PRIMARY KEY,
  vg_key_name text NOT NULL UNIQUE,
  vg_key_value text NOT NULL,
  CONSTRAINT vg_settings_positive_int CHECK (
    vg_key_name NOT IN (
      'vg_app_user_session_ttl_days',
      'vg_app_user_session_cap',
      'vg_app_user_lock_max_failures',
      'vg_app_user_lock_window_minutes',
      'vg_app_user_lock_duration_minutes'
    )
    OR vg_key_value ~ '^[1-9][0-9]*$'
  )
);
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vg_settings_positive_int'
  ) THEN
    ALTER TABLE vg_settings
      ADD CONSTRAINT vg_settings_positive_int CHECK (
        vg_key_name NOT IN (
          'vg_app_user_session_ttl_days',
          'vg_app_user_session_cap',
          'vg_app_user_lock_max_failures',
          'vg_app_user_lock_window_minutes',
          'vg_app_user_lock_duration_minutes'
        )
        OR vg_key_value ~ '^[1-9][0-9]*$'
      );
  END IF;
END$$;
INSERT INTO vg_settings (vg_key_name, vg_key_value)
  VALUES ('vg_app_user_session_ttl_days', '3')
  ON CONFLICT (vg_key_name) DO NOTHING;
INSERT INTO vg_settings (vg_key_name, vg_key_value)
  VALUES ('vg_app_user_session_cap', '3')
  ON CONFLICT (vg_key_name) DO NOTHING;
INSERT INTO vg_settings (vg_key_name, vg_key_value)
  VALUES ('vg_app_user_lock_max_failures', '5')
  ON CONFLICT (vg_key_name) DO NOTHING;
INSERT INTO vg_settings (vg_key_name, vg_key_value)
  VALUES ('vg_app_user_lock_window_minutes', '5')
  ON CONFLICT (vg_key_name) DO NOTHING;
INSERT INTO vg_settings (vg_key_name, vg_key_value)
  VALUES ('vg_app_user_lock_duration_minutes', '10')
  ON CONFLICT (vg_key_name) DO NOTHING;
INSERT INTO vg_settings (vg_key_name, vg_key_value)
  VALUES ('admin_pw', 'vg_custom')
  ON CONFLICT (vg_key_name) DO NOTHING;

-- Project-scoped overrides for vg settings.
CREATE TABLE IF NOT EXISTS vg_project_settings (
  id bigserial PRIMARY KEY,
  "projectId" integer NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  vg_key_name text NOT NULL,
  vg_key_value text NOT NULL,
  CONSTRAINT vg_project_settings_positive_int CHECK (
    vg_key_name NOT IN (
      'vg_app_user_session_ttl_days',
      'vg_app_user_session_cap',
      'vg_app_user_lock_max_failures',
      'vg_app_user_lock_window_minutes',
      'vg_app_user_lock_duration_minutes'
    )
    OR vg_key_value ~ '^[1-9][0-9]*$'
  ),
  CONSTRAINT vg_project_settings_unique UNIQUE ("projectId", vg_key_name)
);
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vg_project_settings_positive_int'
  ) THEN
    ALTER TABLE vg_project_settings DROP CONSTRAINT vg_project_settings_positive_int;
  END IF;
  ALTER TABLE vg_project_settings
    ADD CONSTRAINT vg_project_settings_positive_int CHECK (
      vg_key_name NOT IN (
        'vg_app_user_session_ttl_days',
        'vg_app_user_session_cap',
        'vg_app_user_lock_max_failures',
        'vg_app_user_lock_window_minutes',
        'vg_app_user_lock_duration_minutes'
      )
      OR vg_key_value ~ '^[1-9][0-9]*$'
    );
END$$;

-- Login attempt log for rate limiting/lockout.
CREATE TABLE IF NOT EXISTS vg_app_user_login_attempts (
  id bigserial PRIMARY KEY,
  username text NOT NULL,
  ip text,
  succeeded boolean NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vg_login_attempts_user_createdat ON vg_app_user_login_attempts (username, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_vg_login_attempts_ip_createdat ON vg_app_user_login_attempts (ip, "createdAt" DESC);

-- Lockout state tracking.
CREATE TABLE IF NOT EXISTS vg_app_user_lockouts (
  id bigserial PRIMARY KEY,
  username text NOT NULL,
  ip text,
  locked_until timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vg_login_lockouts_user_createdat ON vg_app_user_lockouts (username, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_vg_login_lockouts_ip_createdat ON vg_app_user_lockouts (ip, "createdAt" DESC);

-- App-user session metadata (IP/device tracking).
CREATE TABLE IF NOT EXISTS vg_app_user_sessions (
  id bigserial PRIMARY KEY,
  token text NOT NULL UNIQUE,
  "actorId" integer NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  ip text NULL,
  user_agent text NULL,
  device_id text NULL,
  comments text NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NULL
);
ALTER TABLE IF EXISTS vg_app_user_sessions
  ADD COLUMN IF NOT EXISTS device_id text;
ALTER TABLE IF EXISTS vg_app_user_sessions
  ADD COLUMN IF NOT EXISTS comments text;
ALTER TABLE IF EXISTS vg_app_user_sessions
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;
-- Convert ip from inet to text if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vg_app_user_sessions'
    AND column_name = 'ip'
    AND data_type = 'inet'
  ) THEN
    ALTER TABLE vg_app_user_sessions ALTER COLUMN ip TYPE text USING ip::text;
  END IF;
END$$;
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vg_app_user_login_attempts'
    AND column_name = 'ip'
    AND data_type = 'inet'
  ) THEN
    ALTER TABLE vg_app_user_login_attempts ALTER COLUMN ip TYPE text USING ip::text;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS idx_vg_app_user_sessions_actor_createdat ON vg_app_user_sessions ("actorId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_vg_app_user_sessions_expires_at ON vg_app_user_sessions (expires_at DESC);

-- App-user telemetry data (device metadata, location, timestamps).
CREATE TABLE IF NOT EXISTS vg_app_user_telemetry (
  id bigserial PRIMARY KEY,
  "actorId" integer NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  collect_version text NOT NULL,
  device_date_time timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  client_event_id text NULL,
  event jsonb NULL,
  location_lat double precision NULL,
  location_lng double precision NULL,
  location_altitude double precision NULL,
  location_accuracy double precision NULL,
  location_speed double precision NULL,
  location_bearing double precision NULL,
  location_provider text NULL
);
ALTER TABLE IF EXISTS vg_app_user_telemetry
  ADD COLUMN IF NOT EXISTS client_event_id text,
  ADD COLUMN IF NOT EXISTS event jsonb;
CREATE INDEX IF NOT EXISTS idx_vg_app_user_telemetry_actor_received ON vg_app_user_telemetry ("actorId", received_at DESC);
CREATE INDEX IF NOT EXISTS idx_vg_app_user_telemetry_device_received ON vg_app_user_telemetry (device_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_vg_app_user_telemetry_received ON vg_app_user_telemetry (received_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_vg_app_user_telemetry_actor_device_client_event
  ON vg_app_user_telemetry ("actorId", device_id, client_event_id)
  WHERE client_event_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_vg_app_user_telemetry_actor_device_time_no_event
  ON vg_app_user_telemetry ("actorId", device_id, device_date_time)
  WHERE client_event_id IS NULL;

-- Ensure admin/manager roles can update app users (displayName/phone).
UPDATE roles
SET verbs = coalesce(verbs, '[]'::jsonb) || '["field_key.update"]'::jsonb
WHERE system IN ('admin', 'manager');

-- Add project.read to app-user role so they can access GET /v1/projects/:id
UPDATE roles
SET verbs = verbs || '["project.read"]'::jsonb
WHERE system = 'app-user'
  AND NOT verbs @> '["project.read"]'::jsonb;

COMMIT;
