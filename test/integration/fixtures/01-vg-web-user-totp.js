const { sql } = require('slonik');

// Fixture to populate VG web-user TOTP and IP whitelist data for tests.
// Schema creation is now handled by migrations.
module.exports = async ({ run }) => {
  // Insert extra test data if needed here.
  // The base settings are already inserted by the migration up.sql.
  
  // Example: You could pre-enable TOTP for a specific test actor here if needed
  // await run(sql`INSERT INTO vg_web_user_totp ("actorId", totp_secret, totp_enabled) VALUES (...)`);
};