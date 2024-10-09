// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/userModel');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Assuming 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token', error });
  }
};

module.exports = { authenticate };
