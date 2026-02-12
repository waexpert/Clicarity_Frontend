import { useCallback } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

/**
 * Converts standard Base64 to URL-safe Base64
 * Replaces: + → -, / → _, removes trailing =
 */
const toUrlSafe = (base64) => {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/**
 * Converts URL-safe Base64 back to standard Base64
 * Reverses: - → +, _ → /, re-adds padding =
 */
const fromUrlSafe = (urlSafe) => {
  let base64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/');
  const padding = 4 - (base64.length % 4);
  if (padding !== 4) base64 += '='.repeat(padding);
  return base64;
};

/**
 * useCrypto - Custom hook for AES encryption/decryption
 * Outputs URL-safe strings (no +, /, or = characters)
 * 
 * Usage:
 *   const { encrypt, decrypt } = useCrypto();
 *   const encrypted = encrypt("https://your-webhook.com/endpoint");
 *   const decrypted = decrypt(encrypted); // back to original
 */
const useCrypto = () => {
  const encrypt = useCallback((text) => {
    if (!text) {
      console.warn('[useCrypto] encrypt: empty or null value provided');
      return null;
    }

    if (!SECRET_KEY) {
      throw new Error('[useCrypto] VITE_CRYPTO_SECRET_KEY is not defined in .env');
    }

    try {
      const encrypted = CryptoJS.AES.encrypt(String(text), SECRET_KEY).toString();
      return toUrlSafe(encrypted); // convert to URL-safe before returning
    } catch (error) {
      console.error('[useCrypto] Encryption failed:', error);
      throw error;
    }
  }, []);

  const decrypt = useCallback((encryptedText) => {
    if (!encryptedText) {
      console.warn('[useCrypto] decrypt: empty or null value provided');
      return null;
    }

    if (!SECRET_KEY) {
      throw new Error('[useCrypto] VITE_CRYPTO_SECRET_KEY is not defined in .env');
    }

    try {
      const standardBase64 = fromUrlSafe(encryptedText); // convert back before decrypting
      const bytes = CryptoJS.AES.decrypt(standardBase64, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        throw new Error('Decryption resulted in an empty string — key mismatch or corrupted data');
      }

      return decrypted;
    } catch (error) {
      console.error('[useCrypto] Decryption failed:', error);
      throw error;
    }
  }, []);

  return { encrypt, decrypt };
};

export default useCrypto;