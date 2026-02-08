const should = require('should');
const { sql } = require('slonik');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg TOTP enrollment query methods', () => {
  describe('isRoleMandatoryForTotp', () => {
    it('should return true for admin when admin is in mandatory roles', testService(async (service, container) => {
      const asAlice = await service.login('alice');

      // Get Alice's actorId (Alice is an admin)
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // Check if admin role is mandatory
      const isMandatory = await container.VgWebUserTotp.isRoleMandatoryForTotp(actorId);

      isMandatory.should.equal(true);
    }));

    it('should return false for non-admin user', testService(async (service, container) => {
      // Create a user with no system-level role assignments
      await service.login('alice', (asAlice) =>
        asAlice.post('/v1/users')
          .send({ email: 'viewer@getodk.org', password: 'Password123!' })
          .expect(200)
      );

      const viewer = await container.Users.getByEmail('viewer@getodk.org');
      const actorId = viewer.get().actor.id;

      // User with no system-level assignments should not be mandatory
      const isMandatory = await container.VgWebUserTotp.isRoleMandatoryForTotp(actorId);

      isMandatory.should.equal(false);
    }));

    it('should return false when mandatory roles is empty array', testService(async (service, container) => {
      // Set mandatory roles to empty array
      await container.run(sql`
        UPDATE vg_settings
        SET vg_key_value = '[]'
        WHERE vg_key_name = 'vg_totp_mandatory_roles'
      `);

      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      const isMandatory = await container.VgWebUserTotp.isRoleMandatoryForTotp(actorId);

      isMandatory.should.equal(false);

      // Restore default
      await container.run(sql`
        UPDATE vg_settings
        SET vg_key_value = '["admin"]'
        WHERE vg_key_name = 'vg_totp_mandatory_roles'
      `);
    }));
  });

  describe('shouldPromptEnrollment', () => {
    it('should return true for user who has never been prompted', testService(async (service, container) => {
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // Ensure Alice has no TOTP record
      await container.run(sql`
        DELETE FROM vg_web_user_totp WHERE "actorId" = ${actorId}
      `);

      const shouldPrompt = await container.VgWebUserTotp.shouldPromptEnrollment(actorId);

      shouldPrompt.should.equal(true);
    }));

    it('should return false for user who already has TOTP enabled', testService(async (service, container) => {
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // Create TOTP record with totp_enabled = true
      await container.run(sql`
        INSERT INTO vg_web_user_totp ("actorId", totp_secret, totp_enabled, totp_enabled_at, created_at, updated_at)
        VALUES (${actorId}, 'JBSWY3DPEHPK3PXP', true, NOW(), NOW(), NOW())
        ON CONFLICT ("actorId") DO UPDATE
        SET totp_enabled = true, totp_enabled_at = NOW()
      `);

      const shouldPrompt = await container.VgWebUserTotp.shouldPromptEnrollment(actorId);

      shouldPrompt.should.equal(false);
    }));

    it('should return false for user who dismissed permanently', testService(async (service, container) => {
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // Create TOTP record with permanent dismissal
      await container.run(sql`
        INSERT INTO vg_web_user_totp ("actorId", totp_enabled, totp_prompt_dismissed_at, created_at, updated_at)
        VALUES (${actorId}, false, NOW(), NOW(), NOW())
        ON CONFLICT ("actorId") DO UPDATE
        SET totp_enabled = false, totp_prompt_dismissed_at = NOW(), totp_prompt_remind_after = NULL
      `);

      const shouldPrompt = await container.VgWebUserTotp.shouldPromptEnrollment(actorId);

      shouldPrompt.should.equal(false);
    }));

    it('should return false for user with future remind date', testService(async (service, container) => {
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // Create TOTP record with remind date 7 days in future
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await container.run(sql`
        INSERT INTO vg_web_user_totp ("actorId", totp_enabled, totp_prompt_remind_after, created_at, updated_at)
        VALUES (${actorId}, false, ${futureDate.toISOString()}, NOW(), NOW())
        ON CONFLICT ("actorId") DO UPDATE
        SET totp_enabled = false, totp_prompt_remind_after = ${futureDate.toISOString()}, totp_prompt_dismissed_at = NULL
      `);

      const shouldPrompt = await container.VgWebUserTotp.shouldPromptEnrollment(actorId);

      shouldPrompt.should.equal(false);
    }));

    it('should return true for user with past remind date', testService(async (service, container) => {
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // Create TOTP record with remind date in past
      const pastDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
      await container.run(sql`
        INSERT INTO vg_web_user_totp ("actorId", totp_enabled, totp_prompt_remind_after, created_at, updated_at)
        VALUES (${actorId}, false, ${pastDate.toISOString()}, NOW(), NOW())
        ON CONFLICT ("actorId") DO UPDATE
        SET totp_enabled = false, totp_prompt_remind_after = ${pastDate.toISOString()}, totp_prompt_dismissed_at = NULL
      `);

      const shouldPrompt = await container.VgWebUserTotp.shouldPromptEnrollment(actorId);

      shouldPrompt.should.equal(true);
    }));
  });

  describe('dismissEnrollmentPrompt', () => {
    it('should set totp_prompt_dismissed_at for permanent dismissal', testService(async (service, container) => {
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // Dismiss permanently (remindAfterDays = null)
      await container.VgWebUserTotp.dismissEnrollmentPrompt(actorId, null);

      // Verify dismissal was recorded
      const record = await container.one(sql`
        SELECT totp_prompt_dismissed_at, totp_prompt_remind_after
        FROM vg_web_user_totp
        WHERE "actorId" = ${actorId}
      `);

      should.exist(record.totp_prompt_dismissed_at);
      should.not.exist(record.totp_prompt_remind_after);
    }));

    it('should set totp_prompt_remind_after for remind later', testService(async (service, container) => {
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // Clear previous dismissal
      await container.run(sql`
        DELETE FROM vg_web_user_totp WHERE "actorId" = ${actorId}
      `);

      // Dismiss with 7-day reminder
      await container.VgWebUserTotp.dismissEnrollmentPrompt(actorId, 7);

      // Verify remind_after was set
      const record = await container.one(sql`
        SELECT totp_prompt_dismissed_at, totp_prompt_remind_after
        FROM vg_web_user_totp
        WHERE "actorId" = ${actorId}
      `);

      should.not.exist(record.totp_prompt_dismissed_at);
      should.exist(record.totp_prompt_remind_after);

      // Verify date is approximately 7 days in future
      const remindDate = new Date(record.totp_prompt_remind_after);
      const expectedDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const diff = Math.abs(remindDate - expectedDate);

      // Allow 10 second tolerance
      (diff < 10000).should.equal(true);
    }));

    it('should overwrite previous dismissal with new remind date', testService(async (service, container) => {
      const alice = await container.Users.getByEmail('alice@getodk.org');
      const actorId = alice.get().actor.id;

      // First: permanent dismissal
      await container.VgWebUserTotp.dismissEnrollmentPrompt(actorId, null);

      // Then: change to 7-day reminder
      await container.VgWebUserTotp.dismissEnrollmentPrompt(actorId, 7);

      // Verify only remind_after is set, dismissed_at is cleared
      const record = await container.one(sql`
        SELECT totp_prompt_dismissed_at, totp_prompt_remind_after
        FROM vg_web_user_totp
        WHERE "actorId" = ${actorId}
      `);

      should.not.exist(record.totp_prompt_dismissed_at);
      should.exist(record.totp_prompt_remind_after);
    }));
  });
});
