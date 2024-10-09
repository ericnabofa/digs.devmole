// routes/authRoutes.js
const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Registration Route
router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  register
);

// Login Route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

module.exports = router;
