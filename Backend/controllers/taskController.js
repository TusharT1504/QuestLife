const Task = require('../models/taskModel');

// Get all tasks for the authenticated user, sorted by priority (high first) then by creation date
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ userId })
      .select('_id title description difficulty xpReward coinReward category priority completed createdAt')
      .sort({ priority: -1, createdAt: -1 }); // Sort by priority (high first), then by creation date
    
    // Custom sort: high > medium > low priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    tasks.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, difficulty, category, priority } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }
    
    const task = new Task({
      userId,
      title: title.trim(),
      description: description?.trim() || '',
      difficulty: difficulty || 'medium',
      category: category || 'daily',
      priority: priority || 'medium',
      dueDate: new Date(),
    });
    
    await task.save();
    
    // Return the complete task object
    const savedTask = await Task.findById(task._id)
      .select('_id title description difficulty xpReward coinReward category priority completed createdAt');
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task.' });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description, difficulty, category, priority } = req.body;
    
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    
    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (difficulty) task.difficulty = difficulty;
    if (category) task.category = category;
    if (priority) task.priority = priority;
    
    await task.save();
    
    // Return the complete updated task object
    const updatedTask = await Task.findById(taskId)
      .select('_id title description difficulty xpReward coinReward category priority completed createdAt');
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task.' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json({ message: 'Task deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task.' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}; 