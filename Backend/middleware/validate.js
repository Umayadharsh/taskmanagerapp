const { body, query, param, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map(e => ({
      field: e.path,
      message: e.msg,
    }));
    return errorResponse(res, 422, 'Validation failed', formatted);
  }
  next();
};

// ── Auth validators ──────────────────────────────────────────────────────────

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ── Task validators ──────────────────────────────────────────────────────────

const createTaskRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 200 }).withMessage('Title must be 1–200 characters')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters')
    .escape(),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed']).withMessage('Status must be todo, in-progress, or completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
];

const updateTaskRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Title must be 1–200 characters')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters')
    .escape(),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed']).withMessage('Status must be todo, in-progress, or completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
];

const taskQueryRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100')
    .toInt(),

  query('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status filter'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority filter'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search term too long')
    .escape(),
];

const mongoIdRule = [
  param('id').isMongoId().withMessage('Invalid task ID'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  createTaskRules,
  updateTaskRules,
  taskQueryRules,
  mongoIdRule,
};