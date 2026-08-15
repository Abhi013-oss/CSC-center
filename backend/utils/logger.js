/**
 * Structured Production Logger
 * Logs request metadata while filtering out sensitive credentials, secrets, and PII.
 */
export const logger = {
  info: (msg, meta = {}) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'INFO', message: msg, ...sanitize(meta) }));
  },
  warn: (msg, meta = {}) => {
    console.warn(JSON.stringify({ timestamp: new Date().toISOString(), level: 'WARN', message: msg, ...sanitize(meta) }));
  },
  error: (msg, meta = {}) => {
    console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: 'ERROR', message: msg, ...sanitize(meta) }));
  }
};

const sanitize = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = { ...obj };

  const secretKeys = ['password', 'token', 'authorization', 'secret', 'key', 'card', 'cvv', 'signature', 'document'];
  for (const key of Object.keys(clean)) {
    const lower = key.toLowerCase();
    if (secretKeys.some(k => lower.includes(k))) {
      clean[key] = '[REDACTED]';
    }
  }

  return clean;
};
