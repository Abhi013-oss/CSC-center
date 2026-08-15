/**
 * Async Error Handler Wrapper for Express Controllers
 * Eliminates redundant try/catch boilerplate across route handlers.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
