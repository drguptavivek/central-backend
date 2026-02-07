const { sql } = require('slonik');

// Fixture to create VG web-user TOTP and IP whitelist tables for tests.
// This runs after migrations, so core tables (users, sessions, actors) already exist.
// IMPORTANT: We do NOT use foreign key constraints to allow "drop owned by current_user" to work.
module.exports = async ({ run }) => {
  // First, drop any existing VG tables that might have foreign key constraints
  await run(sql`DROP TABLE IF EXISTS vg_web_user_totp_backup_codes CASCADE`);
  await run(sql`DROP TABLE IF EXISTS vg_web_user_totp_attempts CASCADE`);
  await run(sql`DROP TABLE IF EXISTS vg_web_user_totp CASCADE`);
  await run(sql`DROP TABLE IF EXISTS vg_user_ip_whitelist CASCADE`);

  // Create vg_settings table first (needed for TOTP settings)
  // Note: 03-vg-app-user-auth.js will add the full constraint
  await run(sql`
    CREATE TABLE IF NOT EXISTS vg_settings (
      id serial PRIMARY KEY,
      vg_key_name text NOT NULL UNIQUE,
      vg_key_value text NOT NULL
    )
  `);

  // Insert TOTP settings
  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('vg_web_user_totp_mandatory', 'false')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);
  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('vg_totp_max_failures', '5')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);
  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('vg_totp_window_minutes', '5')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);
  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('vg_totp_lock_duration_minutes', '15')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);

  // Add totp_verified column to sessions table
  await run(sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS totp_verified boolean NOT NULL DEFAULT true`);

  // Create VG web user TOTP tables (no FK constraints to allow "drop owned by current_user")
  await run(sql`
    CREATE TABLE IF NOT EXISTS vg_web_user_totp (
      "actorId" integer PRIMARY KEY,
      totp_secret text NOT NULL,
      totp_enabled boolean NOT NULL DEFAULT false,
      totp_enabled_at timestamptz NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await run(sql`CREATE INDEX IF NOT EXISTS idx_vg_web_user_totp_enabled ON vg_web_user_totp (totp_enabled)`);

  await run(sql`
    CREATE TABLE IF NOT EXISTS vg_web_user_totp_backup_codes (
      id bigserial PRIMARY KEY,
      "actorId" integer NOT NULL,
      code_hash text NOT NULL,
      used_at timestamptz NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await run(sql`
    CREATE INDEX IF NOT EXISTS idx_vg_backup_codes_actor_unused
    ON vg_web_user_totp_backup_codes ("actorId", used_at)
    WHERE used_at IS NULL
  `);

  await run(sql`
    CREATE TABLE IF NOT EXISTS vg_web_user_totp_attempts (
      id bigserial PRIMARY KEY,
      "actorId" integer NOT NULL,
      ip text NULL,
      success boolean NOT NULL,
      attempt_type text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await run(sql`
    CREATE INDEX IF NOT EXISTS idx_vg_totp_attempts_actor_created
    ON vg_web_user_totp_attempts ("actorId", created_at DESC)
  `);
  await run(sql`
    CREATE INDEX IF NOT EXISTS idx_vg_totp_attempts_ip_created
    ON vg_web_user_totp_attempts (ip, created_at DESC)
  `);

  // Create VG user IP whitelist table (no FK constraints to allow "drop owned by current_user")
  await run(sql`
    CREATE TABLE IF NOT EXISTS vg_user_ip_whitelist (
      id bigserial PRIMARY KEY,
      "actorId" integer NOT NULL,
      ip_cidr cidr NOT NULL,
      description text NULL,
      enabled boolean NOT NULL DEFAULT true,
      created_by integer NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await run(sql`
    CREATE INDEX IF NOT EXISTS idx_vg_ip_whitelist_actor_enabled
    ON vg_user_ip_whitelist ("actorId", enabled)
    WHERE enabled = true
  `);
};
