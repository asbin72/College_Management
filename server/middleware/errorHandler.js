/**
 * Centralized Express Error Handling Middleware
 * Ensures uniform JSON error structures across all API routes.
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[Express Error] ${req.method} ${req.originalUrl || req.url}:`, {
    name: err.name,
    message: err.message,
    stack: isProd ? undefined : err.stack
  });

  const response = {
    success: false,
    message: isProd && statusCode === 500 ? 'An internal server error occurred. Please try again later.' : (err.message || 'Internal Server Error'),
    errorCode: err.errorCode || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 403 ? 'FORBIDDEN' : statusCode === 400 ? 'BAD_REQUEST' : 'SERVER_ERROR')
  };

  if (!isProd && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
