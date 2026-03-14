const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    // Read token from HTTP-only cookie (primary) or Authorization header (fallback for API testing)
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 401, 'Authentication required. Please log in.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without password)
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 401, 'User no longer exists.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token. Please log in again.');
    }
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token has expired. Please log in again.');
    }
    return errorResponse(res, 500, 'Authentication error.');
  }
};

module.exports = { authenticate };