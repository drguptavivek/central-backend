const should = require('should');
const { sql } = require('slonik');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg settings', () => {
  it('should return default mandatory roles (["admin"])', testService(async (service, container) => {
    // Clear any existing setting
    await container.run(sql`DELETE FROM vg_settings WHERE vg_key_name = 'vg_totp_mandatory_roles'`);

    await service.login('alice', (asAlice) =>
      asAlice.get('/v1/system/settings/totp-mandatory-roles')
        .expect(200)
        .then(({ body }) => {
          body.mandatoryRoles.should.be.an.Array();
          body.mandatoryRoles.should.containEql('admin');
        })
    );
  }));

  it('should update mandatory roles', testService(async (service, container) => {
    // We know 'admin' role exists. Let's just use that.
    const targetRoles = ['admin'];

    await service.login('alice', (asAlice) =>
      asAlice.put('/v1/system/settings/totp-mandatory-roles')
        .send({ mandatoryRoles: targetRoles })
        .expect(200)
    );

    // Verify update
    const setting = await container.VgSettings.get('vg_totp_mandatory_roles');
    JSON.parse(setting).should.deepEqual(targetRoles);
  }));

  it('should reject invalid role names', testService(async (service) => {
    await service.login('alice', (asAlice) =>
      asAlice.put('/v1/system/settings/totp-mandatory-roles')
        .send({ mandatoryRoles: ['admin', 'invalid-role'] })
        .expect(400)
    );
  }));

  it('should reject invalid data type (not array)', testService(async (service) => {
    await service.login('alice', (asAlice) =>
      asAlice.put('/v1/system/settings/totp-mandatory-roles')
        .send({ mandatoryRoles: 'admin' })
        .expect(400)
    );
  }));

  it('should reject non-admin access', testService(async (service, container) => {
    // Create a project viewer
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users')
        .send({ email: 'viewer_settings@getodk.org', password: 'Password123!' })
        .expect(200)
    );

    // Manual login to get token
    const { body: session } = await service.post('/v1/sessions')
      .send({ email: 'viewer_settings@getodk.org', password: 'Password123!' })
      .expect(200);

    // Try to get settings
    await service.get('/v1/system/settings/totp-mandatory-roles')
      .set('Authorization', `Bearer ${session.token}`)
      .expect(403);
    
    // Try to put settings
    await service.put('/v1/system/settings/totp-mandatory-roles')
      .set('Authorization', `Bearer ${session.token}`)
      .send({ mandatoryRoles: ['admin'] })
      .expect(403);
  }));
});
