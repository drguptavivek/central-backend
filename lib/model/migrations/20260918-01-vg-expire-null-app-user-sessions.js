// Expire legacy app-user sessions that were created before session expiry was
// required. Keeping the rows preserves audit/retention history while ensuring
// they cannot authenticate after the upgrade.
module.exports = require('../pure-sql-migration')(__filename);
