
const { rateLimit } = require("express-rate-limit");

const contactLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many contact requests. Please try again in 5 minutes."
  }
});

module.exports = contactLimiter;
