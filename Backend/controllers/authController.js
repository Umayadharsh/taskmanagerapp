const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { encrypt } = require('../utils/crypto');
const { successResponse, errorResponse } = require('../utils/response');

// Cookie configuration
const cookieOptions = () => ({
  httpOnly: true, // Prevent JS access (XSS protection)
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});

// JWT token generator
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/* ───────────────── REGISTER ───────────────── */

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return errorResponse(res, 409, 'An account with this email already exists.');
    }

    // Create user
    const user = await User.create({ name, email, password });

    const token = signToken(user._id);

    res.cookie('token', token, cookieOptions());

    return successResponse(res, 201, 'Account created successfully.', {
      user: {
        id: user._id,
        name: user.name,
        email: encrypt(user.email), // encrypted email
        createdAt: user.createdAt,
      },
    });

  } catch (err) {

    // Duplicate email
    if (err.code === 11000) {
      return errorResponse(res, 409, 'An account with this email already exists.');
    }

    // Validation errors (password rules etc.)
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }));

      return errorResponse(res, 422, 'Validation failed', errors);
    }

    console.error('Register error:', err);
    return errorResponse(res, 500, 'Registration failed. Please try again.');
  }
};

/* ───────────────── LOGIN ───────────────── */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // explicitly include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      await new Promise(r => setTimeout(r, 300));
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const token = signToken(user._id);

    res.cookie('token', token, cookieOptions());

    return successResponse(res, 200, 'Login successful.', {
      user: {
        id: user._id,
        name: user.name,
        email: encrypt(user.email),
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return errorResponse(res, 500, 'Login failed. Please try again.');
  }
};

/* ───────────────── LOGOUT ───────────────── */

exports.logout = (req, res) => {
  res.cookie('token', '', {
    ...cookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  });

  return successResponse(res, 200, 'Logged out successfully.');
};

/* ───────────────── GET CURRENT USER ───────────────── */

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, 'User not found.');
    }

    return successResponse(res, 200, 'Profile retrieved.', {
      user: {
        id: user._id,
        name: user.name,
        email: encrypt(user.email),
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    console.error('GetMe error:', err);
    return errorResponse(res, 500, 'Could not retrieve profile.');
  }
};