const { sql } = require('slonik');

// Fixture to populate VG app-user auth data for tests.
// Schema creation is now handled by migrations (20260207-01-vg-security-features).
module.exports = async ({ run }) => {
  // The migration already inserts the default 'admin_pw', but we can ensure it here
  // or add other specific test data if required.
  await run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES ('admin_pw', 'vg_custom')
    ON CONFLICT (vg_key_name) DO NOTHING
  `);
};