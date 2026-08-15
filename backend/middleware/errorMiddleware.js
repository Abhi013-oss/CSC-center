import { logger } from '../utils/logger.js';

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const requestId = req.id || 'N/A';

  // Internal log retention with Request ID
  logger.error(err.message || 'Internal Server Error', {
    requestId,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack
  });

  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? 'Something went wrong. Please try again later.' : (err.message || 'Server error.'),
    ...(isProduction ? {} : { stack: err.stack, requestId })
  });
};
