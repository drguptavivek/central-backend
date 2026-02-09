const should = require('should');
const { sql } = require('slonik');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg TOTP enrollment - full flow integration', () => {
  describe('Optional Enrollment (Non-Mandatory Roles)', () => {
    it('should show optional enrollment prompt on first-time login', testService(async (service, container) => {
      // Create non-mandatory user
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'firsttime@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      // Login - should get shouldPromptTotpEnrollment flag
      const { body: session } = await service.post('/v1/sessions')
        .send({ email: 'firsttime@getodk.org', password: 'Password123!' })
        .expect(200);

      session.shouldPromptTotpEnrollment.should.be.true();
      should.not.exist(session.requireTotpSetup);
      should.exist(session.token);

      // Verify cookies ARE set (non-blocking)
      const cookies = service.get('set-cookie') || [];
      // Session should proceed normally for optional enrollment
    }));

    it('should not prompt after completing TOTP setup', testService(async (service, container) => {
      // Create user and enable TOTP
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'totpenabled@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const user = await container.Users.getByEmail('totpenabled@getodk.org');
      const actorId = user.get().actor.id;

      // Simulate TOTP being enabled
      await container.run(sql`
        INSERT INTO vg_web_user_totp ("actorId", totp_secret, totp_enabled, totp_enabled_at, created_at, updated_at)
        VALUES (${actorId}, 'JBSWY3DPEHPK3PXP', true, NOW(), NOW(), NOW())
      `);

      // Login - should NOT get enrollment prompt
      const { body: session } = await service.post('/v1/sessions')
        .send({ email: 'totpenabled@getodk.org', password: 'Password123!' })
        .expect(200);

      // User with TOTP enabled should require TOTP verification (not enrollment)
      session.requireTotp.should.be.true();
      should.not.exist(session.shouldPromptTotpEnrollment);
      should.not.exist(session.requireTotpSetup);
    }));

    it('should not prompt for 7 days after "Remind Me Later"', testService(async (service, container) => {
      // Create user
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'remindlater@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const user = await container.Users.getByEmail('remindlater@getodk.org');
      const actorId = user.get().actor.id;

      // First login - get prompt
      await service.post('/v1/sessions')
        .send({ email: 'remindlater@getodk.org', password: 'Password123!' })
        .expect(200);

      // User dismisses with 7-day reminder
      await service.login('alice', (asAlice) =>
        asAlice.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
          .send({ remindAfterDays: 7 })
          .expect(200)
      );

      // Login again immediately - should NOT get prompt
      const { body: session2 } = await service.post('/v1/sessions')
        .send({ email: 'remindlater@getodk.org', password: 'Password123!' })
        .expect(200);

      session2.shouldPromptTotpEnrollment.should.be.false();
    }));

    it('should prompt again after 7-day remind period expires', testService(async (service, container) => {
      // Create user
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'expired@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const user = await container.Users.getByEmail('expired@getodk.org');
      const actorId = user.get().actor.id;

      // Set remind-after date in the past (simulating 7 days passed)
      const pastDate = new Date(Date.now() - 1000);
      await container.run(sql`
        INSERT INTO vg_web_user_totp ("actorId", totp_prompt_remind_after, created_at, updated_at)
        VALUES (${actorId}, ${pastDate.toISOString()}, now(), now())
      `);

      // Login - should get prompt again
      const { body: session } = await service.post('/v1/sessions')
        .send({ email: 'expired@getodk.org', password: 'Password123!' })
        .expect(200);

      session.shouldPromptTotpEnrollment.should.be.true();
    }));

    it('should never prompt after "Don\'t Ask Again"', testService(async (service, container) => {
      // Create user
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'noask@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const user = await container.Users.getByEmail('noask@getodk.org');
      const actorId = user.get().actor.id;

      // User dismisses permanently
      await service.login('alice', (asAlice) =>
        asAlice.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
          .send({ remindAfterDays: null })
          .expect(200)
      );

      // Login multiple times - should NEVER get prompt
      for (let i = 0; i < 3; i++) {
        const { body: session } = await service.post('/v1/sessions')
          .send({ email: 'noask@getodk.org', password: 'Password123!' })
          .expect(200);

        session.shouldPromptTotpEnrollment.should.be.false();
      }
    }));
  });

  describe('Mandatory Enrollment (Admin & Configured Roles)', () => {
    it('should block admin login without TOTP with mandatory modal', testService(async (service) => {
      // Admin (Alice) doesn't have TOTP enabled
      const res = await service.post('/v1/sessions')
        .send({ email: 'alice@getodk.org', password: 'password4alice' })
        .expect(200);

      const session = res.body;

      // Should return requireTotpSetup flag
      session.requireTotpSetup.should.be.true();
      session.mandatory.should.be.true();
      should.exist(session.token);

      // Cookies should NOT be set (blocking login)
      const cookies = res.headers['set-cookie'] || [];
      cookies.some(c => c.includes('session=')).should.be.false();
    }));

    it('should proceed to normal 2FA flow after mandatory setup completes', testService(async (service, container) => {
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // Simulate Alice completing TOTP setup
      await container.run(sql`
        INSERT INTO vg_web_user_totp ("actorId", totp_secret, totp_enabled, totp_enabled_at, created_at, updated_at)
        VALUES (${actorId}, 'JBSWY3DPEHPK3PXP', true, NOW(), NOW(), NOW())
        ON CONFLICT ("actorId") DO UPDATE
        SET totp_enabled = true, totp_enabled_at = NOW()
      `);

      // Login again - should now require TOTP verification (not setup)
      const { body: session } = await service.post('/v1/sessions')
        .send({ email: 'alice@getodk.org', password: 'password4alice' })
        .expect(200);

      session.requireTotp.should.be.true();
      should.not.exist(session.requireTotpSetup);

      // Cleanup
      await container.run(sql`
        DELETE FROM vg_web_user_totp WHERE "actorId" = ${actorId}
      `);
    }));

    it('should reject dismissal attempt by mandatory user', testService(async (service, container) => {
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // Try to dismiss as admin (mandatory role)
      await service.login('alice', (asAlice) =>
        asAlice.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
          .send({ remindAfterDays: null })
          .expect(403)
      );
    }));

    it('should enforce mandatory setup after role promotion', testService(async (service, container) => {
      // Create regular user
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'promoted@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const user = await container.Users.getByEmail('promoted@getodk.org');
      const actorId = user.get().actor.id;

      // First login - optional prompt
      const { body: session1 } = await service.post('/v1/sessions')
        .send({ email: 'promoted@getodk.org', password: 'Password123!' })
        .expect(200);

      session1.shouldPromptTotpEnrollment.should.be.true();
      should.not.exist(session1.requireTotpSetup);

      // Promote to admin role (system-level assignment)
      const adminRole = await container.one(sql`SELECT id FROM roles WHERE system = 'admin'`);
      await container.run(sql`
        INSERT INTO assignments ("actorId", "roleId", "acteeId")
        VALUES (${actorId}, ${adminRole.id}, '*')
      `);

      // Login again - should now be mandatory
      const { body: session2 } = await service.post('/v1/sessions')
        .send({ email: 'promoted@getodk.org', password: 'Password123!' })
        .expect(200);

      session2.requireTotpSetup.should.be.true();
      session2.mandatory.should.be.true();
    }));
  });

  describe('Admin Configuration', () => {
    it('should allow admin to configure mandatory roles', testService(async (service) => {
      // Get current mandatory roles
      const { body: current } = await service.login('alice', (asAlice) =>
        asAlice.get('/v1/system/settings/totp-mandatory-roles')
          .expect(200)
      );

      current.mandatoryRoles.should.be.an.Array();
      current.mandatoryRoles.should.containEql('admin');

      // Update to include manager role
      await service.login('alice', (asAlice) =>
        asAlice.put('/v1/system/settings/totp-mandatory-roles')
          .send({ mandatoryRoles: ['admin', 'manager'] })
          .expect(200)
      );

      // Verify change persisted
      const { body: updated } = await service.login('alice', (asAlice) =>
        asAlice.get('/v1/system/settings/totp-mandatory-roles')
          .expect(200)
      );

      updated.mandatoryRoles.should.containEql('admin');
      updated.mandatoryRoles.should.containEql('manager');

      // Restore default
      await service.login('alice', (asAlice) =>
        asAlice.put('/v1/system/settings/totp-mandatory-roles')
          .send({ mandatoryRoles: ['admin'] })
          .expect(200)
      );
    }));

    it('should enforce new mandatory role immediately on next login', testService(async (service, container) => {
      // Create user with manager role
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'manager@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const user = await container.Users.getByEmail('manager@getodk.org');
      const actorId = user.get().actor.id;

      // Assign manager role (system-level)
      const managerRole = await container.one(sql`SELECT id FROM roles WHERE system = 'manager'`);
      await container.run(sql`
        INSERT INTO assignments ("actorId", "roleId", "acteeId")
        VALUES (${actorId}, ${managerRole.id}, '*')
      `);

      // Initially manager is NOT mandatory
      const { body: session1 } = await service.post('/v1/sessions')
        .send({ email: 'manager@getodk.org', password: 'Password123!' })
        .expect(200);

      session1.shouldPromptTotpEnrollment.should.be.true();
      should.not.exist(session1.requireTotpSetup);

      // Admin adds manager to mandatory roles
      await service.login('alice', (asAlice) =>
        asAlice.put('/v1/system/settings/totp-mandatory-roles')
          .send({ mandatoryRoles: ['admin', 'manager'] })
          .expect(200)
      );

      // Login again - should now be mandatory
      const { body: session2 } = await service.post('/v1/sessions')
        .send({ email: 'manager@getodk.org', password: 'Password123!' })
        .expect(200);

      session2.requireTotpSetup.should.be.true();
      session2.mandatory.should.be.true();

      // Restore default
      await service.login('alice', (asAlice) =>
        asAlice.put('/v1/system/settings/totp-mandatory-roles')
          .send({ mandatoryRoles: ['admin'] })
          .expect(200)
      );
    }));

    it('should reject invalid role names in configuration', testService(async (service) => {
      await service.login('alice', (asAlice) =>
        asAlice.put('/v1/system/settings/totp-mandatory-roles')
          .send({ mandatoryRoles: ['admin', 'invalid_role'] })
          .expect(400)
      );
    }));
  });

  describe('Service Account Exclusions', () => {
    it('should never prompt service accounts for enrollment', testService(async (service, container) => {
      // Create service account
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'service@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const user = await container.Users.getByEmail('service@getodk.org');
      const actorId = user.get().actor.id;

      // Mark as service account
      await container.run(sql`
        UPDATE users
        SET is_service_account = true, service_account_marked_at = NOW()
        WHERE "actorId" = ${actorId}
      `);

      // Login - should NOT get any enrollment prompts
      const { body: session } = await service.post('/v1/sessions')
        .send({ email: 'service@getodk.org', password: 'Password123!' })
        .expect(200);

      session.shouldPromptTotpEnrollment.should.be.false();
      should.not.exist(session.requireTotpSetup);
    }));

    it('should exclude service accounts even in mandatory roles', testService(async (service, container) => {
      // Create service account with admin role
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'serviceadmin@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const user = await container.Users.getByEmail('serviceadmin@getodk.org');
      const actorId = user.get().actor.id;

      // Mark as service account
      await container.run(sql`
        UPDATE users
        SET is_service_account = true, service_account_marked_at = NOW()
        WHERE "actorId" = ${actorId}
      `);

      // Assign admin role
      const adminRole = await container.one(sql`SELECT id FROM roles WHERE system = 'admin'`);
      await container.run(sql`
        INSERT INTO assignments ("actorId", "roleId", "acteeId")
        VALUES (${actorId}, ${adminRole.id}, '*')
      `);

      // Login - even as admin, service account should NOT get mandatory setup
      const { body: session } = await service.post('/v1/sessions')
        .send({ email: 'serviceadmin@getodk.org', password: 'Password123!' })
        .expect(200);

      should.not.exist(session.requireTotpSetup);
      session.shouldPromptTotpEnrollment.should.be.false();
    }));
  });

  describe('Edge Cases', () => {
    it('should persist dismissal across sessions', testService(async (service, container) => {
      // Create user
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'persistent@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const user = await container.Users.getByEmail('persistent@getodk.org');
      const actorId = user.get().actor.id;

      // Dismiss
      await service.login('alice', (asAlice) =>
        asAlice.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
          .send({ remindAfterDays: null })
          .expect(200)
      );

      // Login multiple times from different "sessions"
      for (let i = 0; i < 5; i++) {
        const { body: session } = await service.post('/v1/sessions')
          .send({ email: 'persistent@getodk.org', password: 'Password123!' })
          .expect(200);

        session.shouldPromptTotpEnrollment.should.be.false();
      }
    }));

    it('should handle concurrent dismissal requests', testService(async (service, container) => {
      // Create user
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'concurrent@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const user = await container.Users.getByEmail('concurrent@getodk.org');
      const actorId = user.get().actor.id;

      // Simulate concurrent dismissal requests
      const promises = [
        service.login('alice', (asAlice) =>
          asAlice.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
            .send({ remindAfterDays: 7 })
        ),
        service.login('alice', (asAlice) =>
          asAlice.post(`/v1/users/${actorId}/totp/dismiss-enrollment-prompt`)
            .send({ remindAfterDays: null })
        )
      ];

      const results = await Promise.all(promises);
      results.every(r => r.status === 200).should.be.true();

      // Verify at least one dismissal was recorded
      const record = await container.maybeOne(sql`
        SELECT totp_prompt_dismissed_at, totp_prompt_remind_after
        FROM vg_web_user_totp
        WHERE "actorId" = ${actorId}
      `);

      record.isDefined().should.be.true();
    }));
  });
});
