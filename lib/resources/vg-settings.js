// VG Settings Resource
//
// Endpoints for managing system-wide settings for VG customizations

const Problem = require('../util/problem');
const { success } = require('../util/http');
const { Config } = require('../model/frames');

module.exports = (service, endpoint) => {
  // GET /v1/system/settings/totp-mandatory-roles
  // Get list of roles that require mandatory TOTP enrollment
  service.get('/system/settings/totp-mandatory-roles', endpoint(async (container, { auth }) => {
    // Requires config.read permission (system-wide)
    await auth.canOrReject('config.read', Config.species);

    const { VgSettings } = container;
    const mandatoryRolesJson = await VgSettings.get('vg_totp_mandatory_roles');
    
    // Default to admin only if not set
    const mandatoryRoles = mandatoryRolesJson 
      ? JSON.parse(mandatoryRolesJson) 
      : ['admin'];

    return { mandatoryRoles };
  }));

  // PUT /v1/system/settings/totp-mandatory-roles
  // Update list of roles that require mandatory TOTP enrollment
  service.put('/system/settings/totp-mandatory-roles', endpoint(async (container, { auth, body }) => {
    // Requires config.set permission (system-wide)
    await auth.canOrReject('config.set', Config.species);

    const { VgSettings, Roles } = container;
    const { mandatoryRoles } = body;

    // Validate: must be array of strings
    if (!Array.isArray(mandatoryRoles) || !mandatoryRoles.every(r => typeof r === 'string')) {
      throw Problem.user.invalidDataTypeOfParameter({
        field: 'mandatoryRoles',
        expected: 'array of role names'
      });
    }

    // Validate: roles must exist in system
    // We check against all available system roles
    const allRoles = await Roles.getAll();
    const validRoleSystemNames = allRoles.map(r => r.system);
    
    const invalidRoles = mandatoryRoles.filter(r => !validRoleSystemNames.includes(r));
    if (invalidRoles.length > 0) {
      throw Problem.user.unexpectedValue({
        field: 'mandatoryRoles',
        value: invalidRoles.join(', '),
        reason: `Roles must be one of: ${validRoleSystemNames.join(', ')}`
      });
    }

    await VgSettings.set('vg_totp_mandatory_roles', JSON.stringify(mandatoryRoles));

    return success();
  }));
};
