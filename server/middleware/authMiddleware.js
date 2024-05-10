// authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken'); // Import the BlacklistedToken model
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach user object to request
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
