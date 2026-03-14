const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

/**
 * Derives a 32-byte key from the env secret using SHA-256
 */
function getKey() {
  const secret = process.env.AES_SECRET_KEY;
  if (!secret) throw new Error('AES_SECRET_KEY is not set in environment variables');
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypt a string value using AES-256-CBC
 * @param {string} plaintext
 * @returns {string} "iv:encrypted" (hex)
 */
function encrypt(plaintext) {
  if (plaintext === null || plaintext === undefined) return plaintext;
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypt an AES-256-CBC encrypted string
 * @param {string} ciphertext "iv:encrypted" (hex)
 * @returns {string} plaintext
 */
function decrypt(ciphertext) {
  if (ciphertext === null || ciphertext === undefined) return ciphertext;
  const [ivHex, encryptedHex] = ciphertext.split(':');
  if (!ivHex || !encryptedHex) return ciphertext; // Not encrypted
  const key = getKey();
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

/**
 * Checks if a string looks like our encrypted format
 */
function isEncrypted(value) {
  if (typeof value !== 'string') return false;
  const parts = value.split(':');
  return parts.length === 2 && parts[0].length === IV_LENGTH * 2;
}

module.exports = { encrypt, decrypt, isEncrypted };