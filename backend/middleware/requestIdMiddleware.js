import crypto from 'crypto';

/**
 * Request ID Middleware
 * Attaches a unique X-Request-ID header to every incoming HTTP request
 * for end-to-end log tracing and debugging.
 */
export const requestIdMiddleware = (req, res, next) => {
  const incomingId = req.headers['x-request-id'];
  const requestId = incomingId || crypto.randomUUID();

  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);

  next();
};
