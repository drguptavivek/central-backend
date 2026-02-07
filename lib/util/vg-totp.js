// VG TOTP Utilities
//
// Provides TOTP (Time-based One-Time Password) functionality using speakeasy.
// Handles secret generation, QR code generation, and verification.

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { createCipheriv, createDecipheriv, randomBytes } = require('crypto');
const { promisify } = require('util');

// Encryption key for TOTP secrets (from environment or default for dev)
const TOTP_ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY ||
  'dev-key-32-bytes-1234567890abcdefghijklmnopqrstuv'; // 32 bytes for AES-256

if (!process.env.TOTP_ENCRYPTION_KEY && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: TOTP_ENCRYPTION_KEY not set. Using insecure default key.');
}

// Ensure key is exactly 32 bytes
const getEncryptionKey = () => {
  const key = Buffer.from(TOTP_ENCRYPTION_KEY);
  if (key.length < 32) {
    return Buffer.concat([key, Buffer.alloc(32 - key.length)]);
  }
  return key.subarray(0, 32);
};

////////////////////////////////////////////////////////////////////////////////
// ENCRYPTION / DECRYPTION

/**
 * Encrypt TOTP secret using AES-256-CBC
 * @param {string} plaintext - Secret to encrypt (base32)
 * @returns {string} - Format: "iv:ciphertext" (both base64)
 */
const encryptSecret = (plaintext) => {
  const key = getEncryptionKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);
  return `${iv.toString('base64')}:${encrypted.toString('base64')}`;
};

/**
 * Decrypt TOTP secret
 * @param {string} ciphertext - Format: "iv:ciphertext" (both base64)
 * @returns {string} - Decrypted secret (base32)
 */
const decryptSecret = (ciphertext) => {
  const [ivB64, encB64] = ciphertext.split(':');
  const key = getEncryptionKey();
  const iv = Buffer.from(ivB64, 'base64');
  const encrypted = Buffer.from(encB64, 'base64');
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
};

////////////////////////////////////////////////////////////////////////////////
// TOTP OPERATIONS

/**
 * Generate a new TOTP secret
 * @returns {Object} - { secret: string (base32), encrypted: string }
 */
const generateSecret = () => {
  const secret = speakeasy.generateSecret({
    name: 'ODK Central',
    length: 32 // 32 bytes = 256 bits
  });
  return {
    secret: secret.base32,
    encrypted: encryptSecret(secret.base32)
  };
};

/**
 * Generate QR code data URL for TOTP setup
 * @param {string} secret - Base32 secret
 * @param {string} email - User email
 * @returns {Promise<string>} - Data URL for QR code image
 */
const generateQRCode = async (secret, email) => {
  const otpauthUrl = speakeasy.otpauthURL({
    secret,
    label: email,
    issuer: 'ODK Central',
    encoding: 'base32'
  });
  return QRCode.toDataURL(otpauthUrl);
};

/**
 * Verify a TOTP code
 * @param {string} token - 6-digit code from user
 * @param {string} secret - Base32 secret (plain or encrypted)
 * @param {Object} options - { window: number (default 1), encrypted: boolean }
 * @returns {boolean} - True if valid
 */
const verifyToken = (token, secret, options = {}) => {
  const { window = 1, encrypted = false } = options;
  const plainSecret = encrypted ? decryptSecret(secret) : secret;

  return speakeasy.totp.verify({
    secret: plainSecret,
    encoding: 'base32',
    token,
    window // Allow ±30s time drift per window unit
  });
};

/**
 * Generate backup codes (8-digit codes)
 * @param {number} count - Number of codes to generate (default 10)
 * @returns {Array<string>} - Array of backup codes (plain text)
 */
const generateBackupCodes = (count = 10) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-digit code (00000000 to 99999999)
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    codes.push(code);
  }
  return codes;
};

module.exports = {
  encryptSecret,
  decryptSecret,
  generateSecret,
  generateQRCode,
  verifyToken,
  generateBackupCodes
};
