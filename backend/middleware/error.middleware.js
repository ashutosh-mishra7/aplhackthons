/**
 * Global enterprise-grade error handler middleware.
 * Conceals stack traces in production to prevent leakage of internal system details.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] Caught Exception:`, err);

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Handle Mongoose Validation or Cast Errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Database Validation Error',
      errors: Object.values(err.errors).map(val => ({
        field: val.path,
        message: val.message
      }))
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid identifier: ${err.value}`,
      error: `Resource not found under field ${err.path}`
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An internal server error occurred',
    ...(isProduction ? {} : { stack: err.stack })
  });
};

module.exports = errorHandler;
