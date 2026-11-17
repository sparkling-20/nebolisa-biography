
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required.",
      "string.min": "Name must contain at least 2 characters.",
      "string.max": "Name cannot exceed 50 characters."
    }),

  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please enter a valid email address."
    }),

  subject: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Subject is required.",
      "string.min": "Subject must contain at least 3 characters.",
      "string.max": "Subject cannot exceed 100 characters."
    }),

  message: Joi.string()
    .trim()
    .custom((value, helpers) => {
      const words = value.split(/\s+/).filter(Boolean);

      if (words.length < 5) {
        return helpers.error("string.minWords");
      }

      return value;
    })
    .required()
    .messages({
      "string.empty": "Message is required.",
      "string.minWords": "Message must contain at least 5 words."
    })
});

module.exports = contactSchema;
