const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Task } = require('../models');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, search, sortBy, order, page, limit } = req.query;
    
    // Build where clause
    const where = { userId: req.user.id };
    
    if (status) {
      where.status = status;
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Sorting
    const sortField = sortBy || 'createdAt';
    const sortOrder = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset
    });

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total: count,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    let task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

// @desc    Get task statistics for dashboard
// @route   GET /api/tasks/stats
// @access  Private
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get counts by status
    const todoCount = await Task.count({
      where: { userId, status: 'Todo' }
    });

    const inProgressCount = await Task.count({
      where: { userId, status: 'In Progress' }
    });

    const completedCount = await Task.count({
      where: { userId, status: 'Completed' }
    });

    const totalCount = todoCount + inProgressCount + completedCount;

    // Get counts by priority
    const lowPriority = await Task.count({
      where: { userId, priority: 'Low' }
    });

    const mediumPriority = await Task.count({
      where: { userId, priority: 'Medium' }
    });

    const highPriority = await Task.count({
      where: { userId, priority: 'High' }
    });

    // Get recent tasks (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTasks = await Task.findAll({
      where: {
        userId,
        createdAt: { [Op.gte]: sevenDaysAgo }
      },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get tasks completed per day (last 7 days)
    const completedByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await Task.count({
        where: {
          userId,
          status: 'Completed',
          updatedAt: {
            [Op.gte]: date,
            [Op.lt]: nextDate
          }
        }
      });

      completedByDay.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      });
    }

    // Overdue tasks
    const overdueCount = await Task.count({
      where: {
        userId,
        status: { [Op.ne]: 'Completed' },
        dueDate: { [Op.lt]: new Date() }
      }
    });

    res.json({
      success: true,
      data: {
        statusStats: {
          todo: todoCount,
          inProgress: inProgressCount,
          completed: completedCount,
          total: totalCount
        },
        priorityStats: {
          low: lowPriority,
          medium: mediumPriority,
          high: highPriority
        },
        completionRate: totalCount > 0 
          ? Math.round((completedCount / totalCount) * 100) 
          : 0,
        overdueCount,
        recentTasks,
        completedByDay
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
