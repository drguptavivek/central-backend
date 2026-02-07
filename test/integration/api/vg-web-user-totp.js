const should = require('should');
const { sql } = require('slonik');
const speakeasy = require('speakeasy');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg web-user totp', () => {
  // Helper to generate a valid TOTP token for a secret
  const generateToken = (secret) => speakeasy.totp({
    secret,
    encoding: 'base32'
  });

  it('should set up TOTP for a user and return secret, QR code, and backup codes', testService(async (service) => {
    const result = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    should.exist(result.secret);
    should.exist(result.qrCode);
    should.exist(result.backupCodes);
    result.secret.should.be.a.String();
    result.secret.should.match(/^[A-Z2-7]+=*$/);
    result.qrCode.should.startWith('data:image/png;base64,');
    result.backupCodes.should.be.an.Array();
    result.backupCodes.should.have.length(10);
    result.backupCodes[0].should.match(/^\d{8}$/);
  }));

  it('should reject TOTP setup if already enabled', testService(async (service) => {
    // First setup
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup').expect(200));

    // Try to setup again
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(409)
        .then(({ body }) => {
          body.code.should.equal(409.4);
          body.message.should.containEql('already activated');
        }));
  }));

  it('should enable TOTP after verifying first code', testService(async (service) => {
    // Setup TOTP
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    // Generate valid token
    const token = generateToken(setup.secret);

    // Enable TOTP
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // Check status
    const status = await service.login('alice', (asAlice) =>
      asAlice.get('/v1/users/1/totp/status')
        .expect(200)
        .then(({ body }) => body));

    status.enabled.should.be.true();
    should.exist(status.enabledAt);
  }));

  it('should reject enabling with invalid TOTP token', testService(async (service) => {
    // Setup TOTP
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup').expect(200));

    // Try to enable with invalid token
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token: '000000' })
        .expect(401)
        .then(({ body }) => {
          body.code.should.equal(401.2);
        }));
  }));

  it('should create session requiring TOTP verification during login', testService(async (service) => {
    // Setup and enable TOTP
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // Log out
    await service.login('alice', (asAlice) =>
      asAlice.delete('/v1/sessions/current').expect(200));

    // Try to login - should get requireTotp flag
    const login = await service.post('/v1/sessions')
      .send({ email: 'alice@opendatakit.org', password: 'alice' })
      .expect(200)
      .then(({ body }) => body);

    login.requireTotp.should.be.true();
    should.exist(login.token);
    should.exist(login.csrf);
  }));

  it('should verify TOTP code and complete two-phase login', testService(async (service) => {
    // Setup and enable TOTP for alice
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // First login phase
    const login = await service.post('/v1/sessions')
      .send({ email: 'alice@opendatakit.org', password: 'alice' })
      .expect(200)
      .then(({ body }) => body);

    // Second phase - verify TOTP
    const totpToken = generateToken(setup.secret);
    await service.post('/v1/sessions/totp-verify')
      .set('Cookie', `__Host-auditAuth=${login.token}`)
      .set('X-CSRF-Token', login.csrf)
      .send({ token: totpToken })
      .expect(200);

    // Should now be able to access protected resources
    await service.get('/v1/audits')
      .set('Cookie', `__Host-auditAuth=${login.token}`)
      .set('X-CSRF-Token', login.csrf)
      .expect(200);
  }));

  it('should accept backup code instead of TOTP token', testService(async (service) => {
    // Setup and enable TOTP
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // First login phase
    const login = await service.post('/v1/sessions')
      .send({ email: 'alice@opendatakit.org', password: 'alice' })
      .expect(200)
      .then(({ body }) => body);

    // Use backup code
    await service.post('/v1/sessions/totp-verify')
      .set('Cookie', `__Host-auditAuth=${login.token}`)
      .set('X-CSRF-Token', login.csrf)
      .send({ token: setup.backupCodes[0], attemptType: 'backup_code' })
      .expect(200);
  }));

  it('should mark backup code as used after consumption', testService(async (service, container) => {
    // Setup and enable TOTP
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // First login phase
    const login = await service.post('/v1/sessions')
      .send({ email: 'alice@opendatakit.org', password: 'alice' })
      .expect(200)
      .then(({ body }) => body);

    // Use backup code
    await service.post('/v1/sessions/totp-verify')
      .set('Cookie', `__Host-auditAuth=${login.token}`)
      .set('X-CSRF-Token', login.csrf)
      .send({ token: setup.backupCodes[0], attemptType: 'backup_code' })
      .expect(200);

    // Check backup code was marked as used
    const { count } = await container.one(sql`
      SELECT COUNT(*)::int FROM vg_web_user_totp_backup_codes
      WHERE "actorId"=1 AND used_at IS NOT NULL
    `);
    Number(count).should.equal(1);
  }));

  it('should not accept same backup code twice', testService(async (service) => {
    // Setup and enable TOTP
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // Use backup code first time
    const login = await service.post('/v1/sessions')
      .send({ email: 'alice@opendatakit.org', password: 'alice' })
      .expect(200)
      .then(({ body }) => body);

    await service.post('/v1/sessions/totp-verify')
      .set('Cookie', `__Host-auditAuth=${login.token}`)
      .set('X-CSRF-Token', login.csrf)
      .send({ token: setup.backupCodes[0], attemptType: 'backup_code' })
      .expect(200);

    // Log out and try again
    await service.post('/v1/sessions')
      .set('Cookie', `__Host-auditAuth=${login.token}`)
      .set('X-CSRF-Token', login.csrf)
      .send({ email: 'alice@opendatakit.org', password: 'alice' })
      .expect(200);

    // Try to use same backup code again
    await service.post('/v1/sessions/totp-verify')
      .set('Cookie', `__Host-auditAuth=${login.token}`)
      .set('X-CSRF-Token', login.csrf)
      .send({ token: setup.backupCodes[0], attemptType: 'backup_code' })
      .expect(401);
  }));

  it('should disable TOTP with password verification', testService(async (service) => {
    // Setup and enable TOTP
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // Disable with password
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/disable')
        .send({ password: 'alice' })
        .expect(200));

    // Check status
    const status = await service.login('alice', (asAlice) =>
      asAlice.get('/v1/users/1/totp/status')
        .expect(200)
        .then(({ body }) => body));

    status.enabled.should.be.false();
  }));

  it('should reject disabling with wrong password', testService(async (service) => {
    // Setup and enable TOTP
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // Try to disable with wrong password
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/disable')
        .send({ password: 'wrongpassword' })
        .expect(401));
  }));

  it('should regenerate backup codes with password verification', testService(async (service) => {
    // Setup and enable TOTP
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // Regenerate backup codes
    const result = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/backup-codes/regenerate')
        .send({ password: 'alice' })
        .expect(200)
        .then(({ body }) => body));

    should.exist(result.backupCodes);
    result.backupCodes.should.be.an.Array();
    result.backupCodes.should.have.length(10);
    // New codes should be different from original
    result.backupCodes.should.not.deepEqual(setup.backupCodes);
  }));

  it('should implement rate limiting for failed TOTP attempts', testService(async (service) => {
    // Setup and enable TOTP
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // First login phase
    const login = await service.post('/v1/sessions')
      .send({ email: 'alice@opendatakit.org', password: 'alice' })
      .expect(200)
      .then(({ body }) => body);

    // Make 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await service.post('/v1/sessions/totp-verify')
        .set('Cookie', `__Host-auditAuth=${login.token}`)
        .set('X-CSRF-Token', login.csrf)
        .send({ token: '000000' })
        .expect(401);
    }

    // 6th attempt should be rate limited with retryAfter
    await service.post('/v1/sessions/totp-verify')
      .set('Cookie', `__Host-auditAuth=${login.token}`)
      .set('X-CSRF-Token', login.csrf)
      .send({ token: '111111' })
      .expect(401)
      .then(({ body }) => {
        should.exist(body.retryAfterSeconds);
        body.retryAfterSeconds.should.be.above(0);
      });
  }));

  it('should allow normal login without TOTP when not enabled', testService(async (service) => {
    // Login normally without TOTP setup
    const login = await service.post('/v1/sessions')
      .send({ email: 'alice@opendatakit.org', password: 'alice' })
      .expect(200)
      .then(({ body }) => body);

    should.not.exist(login.requireTotp);
    should.exist(login.token);
  }));

  it('should skip TOTP verification for setup/enable endpoints', testService(async (service) => {
    // Setup and enable TOTP
    const setup = await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(200)
        .then(({ body }) => body));

    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/enable')
        .send({ token })
        .expect(200));

    // Should still be able to call setup endpoint (it returns already active error)
    await service.login('alice', (asAlice) =>
      asAlice.post('/v1/users/1/totp/setup')
        .expect(409));
  }));
});
