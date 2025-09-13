const errorHandler = (err, req, res, next) => {
  // Log the error with timestamp
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  console.error(err.stack);

  // Determine status code
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Authentication Failed';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Access Denied';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource Not Found';
  }

  // Prepare error response
  const errorResponse = {
    success: false,
    message,
    statusCode
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
    
    // Include additional error details for development
    if (err.errors) {
      errorResponse.errors = err.errors;
    }
    if (err.code) {
      errorResponse.code = err.code;
    }
  }

  // Handle Mongoose errors
  if (err.name === 'CastError') {
    statusCode = 400;
    errorResponse.message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    errorResponse.message = `${field} already exists`;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;