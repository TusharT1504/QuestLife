const { check } = require('express-validator');

const registerValidation = [
  check('username', 'Username is required')
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),

  check('email', 'Please include a valid email')
    .isEmail()
    .normalizeEmail(),

  check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
];

// Login validation
const loginValidation = [
  check('email', 'Please include a valid email')
    .isEmail()
    .normalizeEmail(),

  check('password', 'Password is required')
    .exists()
];

module.exports = {
  registerValidation,
  loginValidation
}; 