const logger = require('../config/logger');

class APIError extends Error {
  constructor(message, statusCode, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const errorConverter = (err, req, res, next) => {
  let error = err;
  
  if (!(error instanceof APIError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Внутрішня помилка сервера';
    error = new APIError(message, statusCode, false, err.stack);
  }
  
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { statusCode, message, isOperational, stack } = err;

  if (!isOperational) {
    logger.error(`Unexpected Error: ${message}`, {
      stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }

  const response = {
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = {
  APIError,
  errorConverter,
  errorHandler,
};