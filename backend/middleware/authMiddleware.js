const jwt = require('jsonwebtoken');
require('dotenv').config();
const { findUserById } = require('../models/userModel'); // Ensure the correct path to the user model

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer header

  if (!token) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debug the decoded payload

    // Fetch the user from the database
    const user = await findUserById(decoded.id);
    console.log('User Found:', user); // Debug the fetched user


    if (!user) {
      return res.status(401).json({ error: 'Invalid token, user not found' });
    }

    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ error: 'Token is invalid or expired', details: error.message });
  }
};
