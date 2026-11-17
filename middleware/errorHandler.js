
const errorHandler = (err, req, res, next) => {
  console.error("Application Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Something went wrong on the server."
        : err.message
  });
};

module.exports = errorHandler;
p