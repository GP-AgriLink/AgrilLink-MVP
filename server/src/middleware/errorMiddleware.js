/**
 * @file errorMiddleware.js
 * @description Custom middleware for handling errors and 404 Not Found responses.
 */

/**
 * Handles requests for routes that do not exist (404 Not Found).
 * It creates an Error object and passes it to the next error-handling middleware.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * A centralized error handler for the entire application.
 * It catches any errors passed through `next(error)` and sends a clean,
 * structured JSON response.
 * @param {object} err - The error object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come through with a 200 status code.
  // This line ensures we set a proper server error code in that case.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Send a structured JSON response
  res.json({
    message: err.message,
    // Only include the stack trace if we are not in production for debugging purposes.
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
