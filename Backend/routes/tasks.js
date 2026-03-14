const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const {
  createTaskRules,
  updateTaskRules,
  taskQueryRules,
  mongoIdRule,
  validate,
} = require('../middleware/validate');

// All task routes require authentication
router.use(authenticate);

router.get('/stats', getTaskStats);
router.get('/', taskQueryRules, validate, getTasks);
router.get('/:id', mongoIdRule, validate, getTask);
router.post('/', createTaskRules, validate, createTask);
router.put('/:id', mongoIdRule, updateTaskRules, validate, updateTask);
router.patch('/:id', mongoIdRule, updateTaskRules, validate, updateTask);
router.delete('/:id', mongoIdRule, validate, deleteTask);

module.exports = router;