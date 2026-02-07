// VG User IP Whitelist Query Module
//
// Database operations for per-user IP whitelisting (Bearer token access control)

const { sql } = require('slonik');

/**
 * Get all IP whitelist entries for a user
 */
const getByActorId = (actorId, enabledOnly = false) => ({ all }) => {
  const enabledFilter = enabledOnly ? sql`AND enabled = true` : sql``;
  return all(sql`
    SELECT id, "actorId", ip_cidr, description, enabled, created_by, created_at, updated_at
    FROM vg_user_ip_whitelist
    WHERE "actorId" = ${actorId}
    ${enabledFilter}
    ORDER BY created_at DESC
  `);
};

/**
 * Get a specific IP whitelist entry
 */
const getById = (entryId) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT id, "actorId", ip_cidr, description, enabled, created_by, created_at, updated_at
    FROM vg_user_ip_whitelist
    WHERE id = ${entryId}
  `);

/**
 * Create a new IP whitelist entry
 */
const create = (actorId, ipCidr, description, createdBy) => ({ one }) =>
  one(sql`
    INSERT INTO vg_user_ip_whitelist ("actorId", ip_cidr, description, enabled, created_by, created_at, updated_at)
    VALUES (${actorId}, ${ipCidr}::cidr, ${description}, true, ${createdBy}, now(), now())
    RETURNING id, "actorId", ip_cidr::text, description, enabled, created_by, created_at, updated_at
  `);

/**
 * Update an IP whitelist entry
 */
const update = (entryId, fields) => ({ one }) => {
  const updates = [];
  if (fields.ipCidr !== undefined) updates.push(sql`ip_cidr = ${fields.ipCidr}::cidr`);
  if (fields.description !== undefined) updates.push(sql`description = ${fields.description}`);
  if (fields.enabled !== undefined) updates.push(sql`enabled = ${fields.enabled}`);
  updates.push(sql`updated_at = now()`);

  return one(sql`
    UPDATE vg_user_ip_whitelist
    SET ${sql.join(updates, sql`, `)}
    WHERE id = ${entryId}
    RETURNING id, "actorId", ip_cidr::text, description, enabled, created_by, created_at, updated_at
  `);
};

/**
 * Delete an IP whitelist entry
 */
const remove = (entryId) => ({ run }) =>
  run(sql`
    DELETE FROM vg_user_ip_whitelist
    WHERE id = ${entryId}
  `);

/**
 * Check if an IP is whitelisted for a user (using PostgreSQL CIDR matching)
 * Returns true if the IP matches any enabled whitelist entry
 */
const isIpWhitelisted = (actorId, ip) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT EXISTS (
      SELECT 1
      FROM vg_user_ip_whitelist
      WHERE "actorId" = ${actorId}
        AND enabled = true
        AND ${ip}::inet <<= ip_cidr
    ) AS whitelisted
  `).then((opt) => opt.map((row) => row.whitelisted).orElse(false));

/**
 * Check if user has any IP whitelist entries (enabled or disabled)
 */
const hasAnyEntries = (actorId) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT EXISTS (
      SELECT 1
      FROM vg_user_ip_whitelist
      WHERE "actorId" = ${actorId}
    ) AS has_entries
  `).then((opt) => opt.map((row) => row.has_entries).orElse(false));

module.exports = {
  getByActorId,
  getById,
  create,
  update,
  remove,
  isIpWhitelisted,
  hasAnyEntries
};
