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

  // Helper to get the current user's ID
  const getMyId = (service) => service.get('/v1/users/current')
    .expect(200)
    .then(({ body }) => body.id);

  // Helper to login and get both token and CSRF
  const fullLogin = (service, email, password) => service.post('/v1/sessions')
    .send({ email, password })
    .expect(200)
    .then(({ body }) => body);

  it('should set up TOTP for a user and return secret, QR code, and backup codes', testService(async (service) => {
    const result = await service.login('alice', async (asAlice) => {
      const id = await getMyId(asAlice);
      return asAlice.post(`/v1/users/${id}/totp/setup`)
        .send({})
        .expect(200)
        .then(({ body }) => body);
    });

    should.exist(result.secret);
    should.exist(result.qrCode);
    should.exist(result.backupCodes);
    result.backupCodes.should.have.length(10);
    result.backupCodes[0].should.match(/^\d{12}$/);
  }));

  it('should reject TOTP setup if already enabled', testService(async (service) => {
    // First setup and enable
    const id = await service.login('alice', async (asAlice) => {
      const id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`)
        .send({ token })
        .expect(200);
        
      return id;
    });

    // Try to setup again - should be rejected even with unverified session
    // (We use a fresh login here which will be unverified)
    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/users/${id}/totp/setup`)
        .send({})
        .expect(409));
  }));

  it('should enable TOTP after verifying first code', testService(async (service) => {
    // Setup TOTP
    let id;
    const setup = await service.login('alice', async (asAlice) => {
      id = await getMyId(asAlice);
      return asAlice.post(`/v1/users/${id}/totp/setup`)
        .send({})
        .expect(200)
        .then(({ body }) => body);
    });

    // Enable TOTP
    const token = generateToken(setup.secret);
    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/users/${id}/totp/enable`)
        .send({ token })
        .expect(200));

    // Check status
    const status = await service.login('alice', (asAlice) =>
      asAlice.get(`/v1/users/${id}/totp/status`)
        .expect(200)
        .then(({ body }) => body));

    status.enabled.should.be.true();
  }));

  it('should reject enabling with invalid TOTP token', testService(async (service) => {
    let id;
    await service.login('alice', async (asAlice) => {
      id = await getMyId(asAlice);
      return asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
    });

    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/users/${id}/totp/enable`)
        .send({ token: '000000' })
        .expect(401));
  }));

  it('should create session requiring TOTP verification during login', testService(async (service) => {
    // Setup and enable TOTP
    await service.login('alice', async (asAlice) => {
      const id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`).send({ token }).expect(200);
    });

    // Try to login
    const login = await service.post('/v1/sessions')
      .send({ email: 'alice@getodk.org', password: 'password4alice' })
      .expect(200)
      .then(({ body }) => body);

    login.requireTotp.should.be.true();
    should.exist(login.token);
  }));

  it('should verify TOTP code and complete two-phase login', testService(async (service) => {
    // Setup and enable TOTP
    const setup = await service.login('alice', async (asAlice) => {
      const id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`).send({ token }).expect(200);
      return res.body;
    });

    // First login phase
    const login = await fullLogin(service, 'alice@getodk.org', 'password4alice');

    // Second phase - verify TOTP
    const totpToken = generateToken(setup.secret);
    await service.post('/v1/sessions/totp-verify')
      .set('Authorization', `Bearer ${login.token}`)
      .send({ token: totpToken })
      .expect(200);

    // Should now be able to access protected resources
    await service.get('/v1/users/current')
      .set('Authorization', `Bearer ${login.token}`)
      .expect(200);
  }));

  it('should accept backup code instead of TOTP token', testService(async (service) => {
    const setup = await service.login('alice', async (asAlice) => {
      const id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`).send({ token }).expect(200);
      return res.body;
    });

    const login = await fullLogin(service, 'alice@getodk.org', 'password4alice');

    await service.post('/v1/sessions/totp-verify')
      .set('Authorization', `Bearer ${login.token}`)
      .send({ token: setup.backupCodes[0], attemptType: 'backup_code' })
      .expect(200);
  }));

  it('should mark backup code as used after consumption', testService(async (service, container) => {
    const setup = await service.login('alice', async (asAlice) => {
      const id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`).send({ token }).expect(200);
      return res.body;
    });

    const login = await fullLogin(service, 'alice@getodk.org', 'password4alice');

    await service.post('/v1/sessions/totp-verify')
      .set('Authorization', `Bearer ${login.token}`)
      .send({ token: setup.backupCodes[0], attemptType: 'backup_code' })
      .expect(200);

    // Check backup code was marked as used
    const { id: actorId } = await container.one(sql`select id from actors where "displayName"='Alice' and type='user'`);
    const { count } = await container.one(sql`
      SELECT COUNT(*)::int FROM vg_web_user_totp_backup_codes
      WHERE "actorId"=${actorId} AND used_at IS NOT NULL
    `);
    Number(count).should.equal(1);
  }));

  it('should not accept same backup code twice', testService(async (service) => {
    const setup = await service.login('alice', async (asAlice) => {
      const id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`).send({ token }).expect(200);
      return res.body;
    });

    const login1 = await fullLogin(service, 'alice@getodk.org', 'password4alice');
    await service.post('/v1/sessions/totp-verify')
      .set('Authorization', `Bearer ${login1.token}`)
      .send({ token: setup.backupCodes[0], attemptType: 'backup_code' })
      .expect(200);

    const login2 = await fullLogin(service, 'alice@getodk.org', 'password4alice');
    await service.post('/v1/sessions/totp-verify')
      .set('Authorization', `Bearer ${login2.token}`)
      .send({ token: setup.backupCodes[0], attemptType: 'backup_code' })
      .expect(401);
  }));

  it('should disable TOTP with password verification', testService(async (service) => {
    let id;
    await service.login('alice', async (asAlice) => {
      id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`).send({ token }).expect(200);
    });

    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/users/${id}/totp/disable`)
        .send({ password: 'password4alice' })
        .expect(200));

    const status = await service.login('alice', (asAlice) =>
      asAlice.get(`/v1/users/${id}/totp/status`)
        .expect(200)
        .then(({ body }) => body));

    status.enabled.should.be.false();
  }));

  it('should reject disabling with wrong password', testService(async (service) => {
    let id;
    await service.login('alice', async (asAlice) => {
      id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`).send({ token }).expect(200);
    });

    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/users/${id}/totp/disable`)
        .send({ password: 'wrongpassword' })
        .expect(401));
  }));

  it('should regenerate backup codes with password verification', testService(async (service) => {
    let id;
    const setup = await service.login('alice', async (asAlice) => {
      id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`).send({ token }).expect(200);
      return res.body;
    });

    const result = await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/users/${id}/totp/backup-codes/regenerate`)
        .send({ password: 'password4alice' })
        .expect(200)
        .then(({ body }) => body));

    should.exist(result.backupCodes);
    result.backupCodes.should.have.length(10);
    result.backupCodes.should.not.deepEqual(setup.backupCodes);
  }));

  it('should implement rate limiting for failed TOTP attempts', testService(async (service) => {
    await service.login('alice', async (asAlice) => {
      const id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`).send({ token }).expect(200);
    });

    const login = await fullLogin(service, 'alice@getodk.org', 'password4alice');

    for (let i = 0; i < 5; i++) {
      await service.post('/v1/sessions/totp-verify')
        .set('Authorization', `Bearer ${login.token}`)
        .send({ token: '000000' })
        .expect(401);
    }

    await service.post('/v1/sessions/totp-verify')
      .set('Authorization', `Bearer ${login.token}`)
      .send({ token: '111111' })
      .expect(429)
      .then(({ body }) => {
        should.exist(body.details.retryAfterSeconds);
      });
  }));

  it('should allow normal login without TOTP when not enabled', testService(async (service) => {
    const login = await service.post('/v1/sessions')
      .send({ email: 'alice@getodk.org', password: 'password4alice' })
      .expect(200)
      .then(({ body }) => body);

    should.not.exist(login.requireTotp);
  }));

  it('should skip TOTP verification for setup/enable endpoints', testService(async (service) => {
    let id;
    await service.login('alice', async (asAlice) => {
      id = await getMyId(asAlice);
      const res = await asAlice.post(`/v1/users/${id}/totp/setup`).send({}).expect(200);
      const token = generateToken(res.body.secret);
      await asAlice.post(`/v1/users/${id}/totp/enable`).send({ token }).expect(200);
    });

    await service.login('alice', (asAlice) =>
      asAlice.post(`/v1/users/${id}/totp/setup`)
        .send({})
        .expect(409));
  }));
});
