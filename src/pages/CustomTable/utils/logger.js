/**
 * Simple logging utility with environment-based filtering
 */
const isDevelopment = import.meta.env.DEV;

export const logger = {
  debug: (...args) => {
    if (isDevelopment) {
      console.log('[DEBUG]', new Date().toISOString(), ...args);
    }
  },
  
  info: (...args) => {
    console.info('[INFO]', new Date().toISOString(), ...args);
  },
  
  warn: (...args) => {
    console.warn('[WARN]', new Date().toISOString(), ...args);
  },
  
  error: (...args) => {
    console.error('[ERROR]', new Date().toISOString(), ...args);
  },
  
  group: (label, fn) => {
    if (isDevelopment) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  }
};