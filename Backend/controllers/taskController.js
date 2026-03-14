const Task = require('../models/task');
const { successResponse, errorResponse } = require('../utils/response');

// ─── List Tasks (with pagination, filtering, search) ─────────────────────

exports.getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter — always scope to authenticated user
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Text search on title / description
    if (search && search.trim()) {
      // Use regex for partial match (works without full text index too)
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sorting
    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'status', 'priority', 'dueDate'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const safeSortOrder = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute queries in parallel for performance
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ [safeSortBy]: safeSortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Task.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return successResponse(res, 200, 'Tasks retrieved successfully.', {
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    console.error('GetTasks error:', err);
    return errorResponse(res, 500, 'Failed to retrieve tasks.');
  }
};

// ─── Get single task ─────────────────────────────────────────────────────

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return errorResponse(res, 404, 'Task not found.');
    }

    return successResponse(res, 200, 'Task retrieved.', { task });
  } catch (err) {
    console.error('GetTask error:', err);
    return errorResponse(res, 500, 'Failed to retrieve task.');
  }
};

// ─── Create task ─────────────────────────────────────────────────────────

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      user: req.user._id,
    });

    return successResponse(res, 201, 'Task created successfully.', { task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message,
      }));
      return errorResponse(res, 422, 'Validation failed.', messages);
    }
    console.error('CreateTask error:', err);
    return errorResponse(res, 500, 'Failed to create task.');
  }
};

// ─── Update task ─────────────────────────────────────────────────────────

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Build update object with only provided fields
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate || null;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Authorization enforced here
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return errorResponse(res, 404, 'Task not found.');
    }

    return successResponse(res, 200, 'Task updated successfully.', { task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message,
      }));
      return errorResponse(res, 422, 'Validation failed.', messages);
    }
    console.error('UpdateTask error:', err);
    return errorResponse(res, 500, 'Failed to update task.');
  }
};

// ─── Delete task ──────────────────────────────────────────────────────────

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // Authorization enforced here
    });

    if (!task) {
      return errorResponse(res, 404, 'Task not found.');
    }

    return successResponse(res, 200, 'Task deleted successfully.');
  } catch (err) {
    console.error('DeleteTask error:', err);
    return errorResponse(res, 500, 'Failed to delete task.');
  }
};

// ─── Task stats (for dashboard) ───────────────────────────────────────────

exports.getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = { todo: 0, 'in-progress': 0, completed: 0, total: 0 };
    stats.forEach(s => {
      result[s._id] = s.count;
      result.total += s.count;
    });

    return successResponse(res, 200, 'Stats retrieved.', { stats: result });
  } catch (err) {
    console.error('GetStats error:', err);
    return errorResponse(res, 500, 'Failed to retrieve stats.');
  }
};