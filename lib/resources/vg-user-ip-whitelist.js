// VG User IP Whitelist Resource Endpoints
//
// REST API endpoints for per-user IP whitelist management

const Problem = require('../util/problem');
const { getOrNotFound } = require('../util/promise');
const { success } = require('../util/http');

/**
 * Validate CIDR notation
 */
const validateCidr = (cidr) => {
  if (!cidr || typeof cidr !== 'string') {
    throw Problem.user.missingParameter({ field: 'ipCidr' });
  }

  // Basic CIDR validation (IPv4 and IPv6)
  const ipv4Cidr = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
  const ipv6Cidr = /^([0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}(\/\d{1,3})?$/i;

  if (!ipv4Cidr.test(cidr) && !ipv6Cidr.test(cidr)) {
    throw Problem.user.invalidEntity({ reason: 'Invalid CIDR notation. Expected format: 192.168.1.0/24 or single IP: 192.168.1.1' });
  }

  return cidr;
};

module.exports = (service, endpoint) => {
  // GET /v1/users/:id/ip-whitelist
  // Get all IP whitelist entries for a user
  service.get('/users/:id/ip-whitelist', endpoint(async (container, { auth, params, query }) => {
    const { Users, VgUserIpWhitelist } = container;
    const actorId = parseInt(params.id, 10);
    const enabledOnly = query.enabled === 'true';

    // Get user
    const user = await Users.getByActorId(actorId).then(getOrNotFound);

    // Check permissions
    await auth.canOrReject('user.read', user.actor);

    // Get whitelist entries
    const entries = await VgUserIpWhitelist.getByActorId(actorId, enabledOnly);

    return entries;
  }));

  // POST /v1/users/:id/ip-whitelist
  // Create a new IP whitelist entry
  // Body: { ipCidr: "192.168.1.0/24", description: "Office network" }
  service.post('/users/:id/ip-whitelist', endpoint(async (container, { auth, params, body }) => {
    const { Users, VgUserIpWhitelist, Audits } = container;
    const actorId = parseInt(params.id, 10);
    const { ipCidr, description = null } = body;

    // Validate CIDR
    const validCidr = validateCidr(ipCidr);

    // Get user
    const user = await Users.getByActorId(actorId).then(getOrNotFound);

    // Check permissions
    await auth.canOrReject('user.update', user.actor);

    // Create entry
    const createdBy = auth.actor.get().id;
    const entry = await VgUserIpWhitelist.create(actorId, validCidr, description, createdBy);

    // Audit log
    await Audits.log(auth.actor.orNull(), 'vg.ip_whitelist.create', user.actor, {
      ipCidr: validCidr,
      description
    });

    return entry;
  }));

  // PATCH /v1/users/:id/ip-whitelist/:entryId
  // Update an IP whitelist entry
  // Body: { ipCidr?: "...", description?: "...", enabled?: true/false }
  service.patch('/users/:id/ip-whitelist/:entryId', endpoint(async (container, { auth, params, body }) => {
    const { Users, VgUserIpWhitelist, Audits } = container;
    const actorId = parseInt(params.id, 10);
    const entryId = parseInt(params.entryId, 10);
    const { ipCidr, description, enabled } = body;

    // Get user
    const user = await Users.getByActorId(actorId).then(getOrNotFound);

    // Check permissions
    await auth.canOrReject('user.update', user.actor);

    // Get existing entry to verify ownership
    const existing = await VgUserIpWhitelist.getById(entryId);
    if (!existing) {
      throw Problem.user.notFound();
    }
    if (existing.actorId !== actorId) {
      throw Problem.user.insufficientRights();
    }

    // Build update fields
    const fields = {};
    if (ipCidr !== undefined) fields.ipCidr = validateCidr(ipCidr);
    if (description !== undefined) fields.description = description;
    if (enabled !== undefined) {
      if (typeof enabled !== 'boolean') {
        throw Problem.user.invalidDataTypeOfParameter({ field: 'enabled', expected: 'boolean' });
      }
      fields.enabled = enabled;
    }

    if (Object.keys(fields).length === 0) {
      throw Problem.user.missingParameters({ expected: ['ipCidr', 'description', 'enabled'], got: body });
    }

    // Update entry
    const updated = await VgUserIpWhitelist.update(entryId, fields);

    // Audit log
    await Audits.log(auth.actor.orNull(), 'vg.ip_whitelist.update', user.actor, {
      entryId,
      ...fields
    });

    return updated;
  }));

  // DELETE /v1/users/:id/ip-whitelist/:entryId
  // Delete an IP whitelist entry
  service.delete('/users/:id/ip-whitelist/:entryId', endpoint(async (container, { auth, params }) => {
    const { Users, VgUserIpWhitelist, Audits } = container;
    const actorId = parseInt(params.id, 10);
    const entryId = parseInt(params.entryId, 10);

    // Get user
    const user = await Users.getByActorId(actorId).then(getOrNotFound);

    // Check permissions
    await auth.canOrReject('user.update', user.actor);

    // Get existing entry to verify ownership
    const existing = await VgUserIpWhitelist.getById(entryId);
    if (!existing) {
      throw Problem.user.notFound();
    }
    if (existing.actorId !== actorId) {
      throw Problem.user.insufficientRights();
    }

    // Delete entry
    await VgUserIpWhitelist.remove(entryId);

    // Audit log
    await Audits.log(auth.actor.orNull(), 'vg.ip_whitelist.delete', user.actor, {
      entryId,
      ipCidr: existing.ip_cidr
    });

    return success();
  }));

  // GET /v1/users/:id/ip-whitelist/check
  // Check if a specific IP is whitelisted (for testing)
  // Query: ?ip=192.168.1.100
  service.get('/users/:id/ip-whitelist/check', endpoint(async (container, { auth, params, query }) => {
    const { Users, VgUserIpWhitelist } = container;
    const actorId = parseInt(params.id, 10);
    const { ip } = query;

    if (!ip) {
      throw Problem.user.missingParameter({ field: 'ip' });
    }

    // Get user
    const user = await Users.getByActorId(actorId).then(getOrNotFound);

    // Check permissions
    await auth.canOrReject('user.read', user.actor);

    // Check if IP is whitelisted
    const whitelisted = await VgUserIpWhitelist.isIpWhitelisted(actorId, ip);

    return { ip, whitelisted };
  }));
};
