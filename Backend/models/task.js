const mongoose = require('mongoose');

const TASK_STATUSES = ['todo', 'in-progress', 'completed'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: TASK_STATUSES,
        message: 'Status must be one of: todo, in-progress, completed',
      },
      default: 'todo',
    },
    priority: {
      type: String,
      enum: {
        values: TASK_PRIORITIES,
        message: 'Priority must be one of: low, medium, high',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Index for fast per-user queries
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

// Compound index for efficient per-user queries with sorting
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, status: 1 });

// Text index for search
taskSchema.index({ title: 'text', description: 'text' });

// Strip __v in output
taskSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Task', taskSchema);
module.exports.TASK_STATUSES = TASK_STATUSES;
module.exports.TASK_PRIORITIES = TASK_PRIORITIES;