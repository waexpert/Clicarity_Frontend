import { useCallback } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

/**
 * useCrypto - Custom hook for AES encryption/decryption
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
      return encrypted;
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
      const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
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