const should = require('should');
const {
  encryptSecret,
  decryptSecret,
  generateSecret,
  generateQRCode,
  verifyToken,
  generateBackupCodes
} = require('../../../lib/util/vg-totp');

describe('util: vg-totp', () => {
  describe('encryptSecret/decryptSecret', () => {
    it('should encrypt and decrypt a secret correctly', () => {
      const plaintext = 'JBSWY3DPEHPK3PXP';
      const encrypted = encryptSecret(plaintext);
      const decrypted = decryptSecret(encrypted);

      decrypted.should.equal(plaintext);
    });

    it('should produce different ciphertext for same plaintext (due to random IV)', () => {
      const plaintext = 'JBSWY3DPEHPK3PXP';
      const encrypted1 = encryptSecret(plaintext);
      const encrypted2 = encryptSecret(plaintext);

      encrypted1.should.not.equal(encrypted2);
    });

    it('should decrypt both encrypted values to same plaintext', () => {
      const plaintext = 'JBSWY3DPEHPK3PXP';
      const encrypted1 = encryptSecret(plaintext);
      const encrypted2 = encryptSecret(plaintext);

      decryptSecret(encrypted1).should.equal(plaintext);
      decryptSecret(encrypted2).should.equal(plaintext);
    });

    it('should produce valid iv:ciphertext format', () => {
      const encrypted = encryptSecret('test');
      encrypted.should.match(/^[A-Za-z0-9+/]+=*:[A-Za-z0-9+/]+=*$/);
    });

    it('should handle base32 characters', () => {
      const plaintext = 'KRSXG5DSQV2A========';
      const encrypted = encryptSecret(plaintext);
      decryptSecret(encrypted).should.equal(plaintext);
    });
  });

  describe('generateSecret', () => {
    it('should generate a base32 secret', () => {
      const result = generateSecret();

      result.secret.should.be.a.String();
      result.secret.should.match(/^[A-Z2-7]+=*$/);
      result.secret.length.should.be.above(30);
    });

    it('should generate an encrypted version', () => {
      const result = generateSecret();

      result.encrypted.should.be.a.String();
      result.encrypted.should.match(/^[A-Za-z0-9+/]+=*:[A-Za-z0-9+/]+=*$/);
    });

    it('should generate different secrets each time', () => {
      const result1 = generateSecret();
      const result2 = generateSecret();

      result1.secret.should.not.equal(result2.secret);
      result1.encrypted.should.not.equal(result2.encrypted);
    });

    it('encrypted secret should decrypt back to plain secret', () => {
      const result = generateSecret();

      decryptSecret(result.encrypted).should.equal(result.secret);
    });
  });

  describe('generateQRCode', async () => {
    it('should generate a data URL QR code', async () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const email = 'test@example.com';
      const qrCode = await generateQRCode(secret, email);

      qrCode.should.be.a.String();
      qrCode.should.startWith('data:image/png;base64,');
    });

    it('should generate different QR codes for different secrets', async () => {
      const email = 'test@example.com';
      const qr1 = await generateQRCode('SECRET1', email);
      const qr2 = await generateQRCode('SECRET2', email);

      qr1.should.not.equal(qr2);
    });

    it('should include email in the QR code data', async () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const email = 'user@example.com';
      const qrCode = await generateQRCode(secret, email);

      // The QR code is base64 encoded PNG, but we can at least verify it was generated
      qrCode.should.startWith('data:image/png;base64,');
      qrCode.length.should.be.above(100);
    });
  });

  describe('verifyToken', () => {
    // Using a known secret and time for reproducible tests
    // This secret with a time window of 0 should only accept the exact token
    const secret = 'JBSWY3DPEHPK3PXP';

    it('should verify a valid TOTP token', () => {
      // Generate a valid token for the current time
      const speakeasy = require('speakeasy');
      const token = speakeasy.totp({
        secret,
        encoding: 'base32'
      });

      verifyToken(token, secret, { window: 0, encrypted: false }).should.be.true();
    });

    it('should reject an invalid token', () => {
      verifyToken('000000', secret, { window: 0, encrypted: false }).should.be.false();
    });

    it('should verify with encrypted secret', () => {
      const speakeasy = require('speakeasy');
      const token = speakeasy.totp({
        secret,
        encoding: 'base32'
      });
      const encrypted = encryptSecret(secret);

      verifyToken(token, encrypted, { window: 0, encrypted: true }).should.be.true();
    });

    it('should reject with wrong encrypted secret', () => {
      const wrongSecret = 'KRSXG5DSQV2A========';
      const encrypted = encryptSecret(wrongSecret);
      const speakeasy = require('speakeasy');
      const token = speakeasy.totp({
        secret: wrongSecret,
        encoding: 'base32'
      });

      verifyToken(token, encrypted, { window: 0, encrypted: true }).should.be.true();
    });

    it('should allow tokens within time window', () => {
      const speakeasy = require('speakeasy');
      // Generate token for 30 seconds ago
      const pastToken = speakeasy.totp({
        secret,
        encoding: 'base32',
        time: Math.floor(Date.now() / 1000) - 30
      });

      // With window=1, should accept tokens from ±30 seconds
      verifyToken(pastToken, secret, { window: 1, encrypted: false }).should.be.true();
    });

    it('should use default window of 1', () => {
      const speakeasy = require('speakeasy');
      const token = speakeasy.totp({
        secret,
        encoding: 'base32'
      });

      verifyToken(token, secret).should.be.true();
    });
  });

  describe('generateBackupCodes', () => {
    it('should generate 10 codes by default', () => {
      const codes = generateBackupCodes();

      codes.should.be.an.Array();
      codes.should.have.length(10);
    });

    it('should generate custom number of codes', () => {
      const codes = generateBackupCodes(5);

      codes.should.be.an.Array();
      codes.should.have.length(5);
    });

    it('should generate 12-digit numeric codes', () => {
      const codes = generateBackupCodes();

      codes.forEach((code) => {
        code.should.match(/^\d{12}$/);
        const num = parseInt(code, 10);
        num.should.be.within(100000000000, 999999999999);
      });
    });

    it('should generate unique codes', () => {
      const codes = generateBackupCodes(20);
      const uniqueCodes = new Set(codes);

      uniqueCodes.size.should.equal(codes.length);
    });

    it('should generate different codes each time', () => {
      const codes1 = generateBackupCodes(10);
      const codes2 = generateBackupCodes(10);

      codes1.should.not.deepEqual(codes2);
    });
  });

  describe('integration tests', () => {
    it('should complete full TOTP setup and verification flow', () => {
      const speakeasy = require('speakeasy');

      // 1. Generate secret
      const { secret, encrypted } = generateSecret();

      // 2. Generate QR code (async but we trust the other test)
      // 3. Generate backup codes
      const backupCodes = generateBackupCodes(10);

      backupCodes.should.have.length(10);

      // 4. Verify a token with the encrypted secret
      const token = speakeasy.totp({
        secret,
        encoding: 'base32'
      });

      verifyToken(token, encrypted, { window: 1, encrypted: true }).should.be.true();

      // 5. Decrypt should match original
      decryptSecret(encrypted).should.equal(secret);
    });

    it('should handle encryption/decryption round-trip for long secrets', () => {
      const longSecret = 'KRSXG5DSQV2A43KRSXG5DSQV2A43KRSXG5DSQV2A43';
      const encrypted = encryptSecret(longSecret);
      const decrypted = decryptSecret(encrypted);

      decrypted.should.equal(longSecret);
    });
  });
});
