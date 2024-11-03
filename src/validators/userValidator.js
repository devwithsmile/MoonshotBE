import Joi from 'joi';

// Define the user schema using Joi
const userSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.base': 'Password must contain at least one letter and one number',
      'any.required': 'Password is required'
    })
});

// Function to validate user input
export const validateUser = (user) => {
  const { error, value } = userSchema.validate(user, { abortEarly: false });
  
  // Return validation result
  return {
    isValid: !error,
    errors: error ? error.details : [],
    value // This will be the validated and sanitized value
  };
};