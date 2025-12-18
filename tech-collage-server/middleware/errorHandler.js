/**
 * Global Error Handler Middleware
 * Handles all errors in a consistent way
 */

const handleMongooseError = (error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return {
      status: 400,
      message: "Validation error",
      errors,
    };
  }

  if (error.name === "CastError") {
    return {
      status: 400,
      message: `Invalid ${error.path}: ${error.value}`,
    };
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return {
      status: 409,
      message: `${field} already exists`,
    };
  }

  return null;
};

const errorHandler = (err, req, res, next) => {
  // Mongoose errors
  const mongooseError = handleMongooseError(err);
  if (mongooseError) {
    return res.status(mongooseError.status).json({
      message: mongooseError.message,
      ...(mongooseError.errors && { errors: mongooseError.errors }),
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  // Default error
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  console.error("Error:", {
    message,
    status,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

