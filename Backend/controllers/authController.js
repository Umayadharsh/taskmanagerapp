const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { encrypt, decrypt } = require('../utils/crypto');
const { successResponse, errorResponse } = require('../utils/response');

// Cookie configuration
const cookieOptions = () => ({
  httpOnly: true,                                     // Prevent JS access (XSS protection)
  secure: process.env.NODE_ENV === 'production',      // HTTPS only in production
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,                  // 7 days in ms
  path: '/',
});

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── Register ─────────────────────────────────────────────────────────────

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return errorResponse(res, 409, 'An account with this email already exists.');
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.cookie('token', token, cookieOptions());

    return successResponse(res, 201, 'Account created successfully.', {
      user: {
        id: user._id,
        name: user.name,
        // Encrypt email in response payload as per security requirement
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return errorResponse(res, 409, 'An account with this email already exists.');
    }
    console.error('Register error:', err);
    return errorResponse(res, 500, 'Registration failed. Please try again.');
  }
};

// ─── Login ────────────────────────────────────────────────────────────────

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Consistent timing to prevent email enumeration
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
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return errorResponse(res, 500, 'Login failed. Please try again.');
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────

exports.logout = (req, res) => {
  res.cookie('token', '', {
    ...cookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  });
  return successResponse(res, 200, 'Logged out successfully.');
};

// ─── Get current user ─────────────────────────────────────────────────────

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return errorResponse(res, 404, 'User not found.');

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