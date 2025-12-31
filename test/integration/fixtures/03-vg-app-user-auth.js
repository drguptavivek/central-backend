const { sql } = require('slonik');

// Ensure vg app-user auth tables/settings exist for tests.
module.exports = async ({ run }) => {
  await run(sql`
    CREATE TABLE IF NOT EXISTS vg_field_key_auth (
      "actorId" integer PRIMARY KEY REFERENCES field_keys("actorId") ON DELETE CASCADE,
      vg_username text NOT NULL,
      vg_password_hash text NOT NULL,
      vg_phone text NULL,
      vg_active boolean NOT NULL DEFAULT true,
      CONSTRAINT vg_field_key_auth_username_normalized CHECK (lower(btrim(vg_username)) = vg_username)
    )
  `);
  await run(sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_vg_field_key_auth_username ON vg_field_key_auth (vg_username)`);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_field_key_auth_active ON vg_field_key_auth (vg_active)`);

  await run(sql`
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
    )
  `);
  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('vg_app_user_session_ttl_days', '3')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);
  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('vg_app_user_session_cap', '3')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);
  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('vg_app_user_lock_max_failures', '5')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);
  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('vg_app_user_lock_window_minutes', '5')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);
  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('vg_app_user_lock_duration_minutes', '10')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);

  await run(sql`
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
    )
  `);

  await run(sql`
    CREATE TABLE IF NOT EXISTS vg_app_user_login_attempts (
      id bigserial PRIMARY KEY,
      username text NOT NULL,
      ip text,
      succeeded boolean NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now()
    )
  `);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_login_attempts_user_createdat ON vg_app_user_login_attempts (username, "createdAt" DESC)`);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_login_attempts_ip_createdat ON vg_app_user_login_attempts (ip, "createdAt" DESC)`);

  await run(sql`
    CREATE TABLE IF NOT EXISTS vg_app_user_lockouts (
      id bigserial PRIMARY KEY,
      username text NOT NULL,
      ip text,
      locked_until timestamptz NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now()
    )
  `);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_login_lockouts_user_createdat ON vg_app_user_lockouts (username, "createdAt" DESC)`);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_login_lockouts_ip_createdat ON vg_app_user_lockouts (ip, "createdAt" DESC)`);

  await run(sql`
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
    )
  `);
  await run(sql`ALTER TABLE IF EXISTS vg_app_user_sessions DROP CONSTRAINT IF EXISTS vg_app_user_sessions_token_fkey`);
  await run(sql`ALTER TABLE IF EXISTS vg_app_user_sessions ADD COLUMN IF NOT EXISTS expires_at timestamptz`);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_app_user_sessions_actor_createdat ON vg_app_user_sessions ("actorId", "createdAt" DESC)`);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_app_user_sessions_expires_at ON vg_app_user_sessions (expires_at DESC)`);

  await run(sql`
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
    )
  `);
  await run(sql`ALTER TABLE IF EXISTS vg_app_user_telemetry ADD COLUMN IF NOT EXISTS client_event_id text`);
  await run(sql`ALTER TABLE IF EXISTS vg_app_user_telemetry ADD COLUMN IF NOT EXISTS event jsonb`);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_app_user_telemetry_actor_received ON vg_app_user_telemetry ("actorId", received_at DESC)`);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_app_user_telemetry_device_received ON vg_app_user_telemetry (device_id, received_at DESC)`);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_app_user_telemetry_received ON vg_app_user_telemetry (received_at DESC)`);
  await run(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_vg_app_user_telemetry_actor_device_client_event
    ON vg_app_user_telemetry ("actorId", device_id, client_event_id)
    WHERE client_event_id IS NOT NULL
  `);
  await run(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_vg_app_user_telemetry_actor_device_time_no_event
    ON vg_app_user_telemetry ("actorId", device_id, device_date_time)
    WHERE client_event_id IS NULL
  `);

  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('admin_pw', 'vg_custom')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);
};
