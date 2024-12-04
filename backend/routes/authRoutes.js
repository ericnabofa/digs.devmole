// routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust based on your user model's location
const authMiddleware = require('../middleware/authMiddleware'); // Optional middleware to verify token

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


// Middleware to verify token
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user is already populated by the middleware
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
