const User = require('../models/userModel');
const Task = require('../models/taskModel');
const { getUserStats, awardXP } = require('../utils/levelingSystem');

// Get user dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = getUserStats(user);
    res.json(stats);
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile with motivation
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('username motivation lastLoginDate');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      motivation: user.motivation,
      lastLoginDate: user.lastLoginDate
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get today's tasks for user
const getTodayTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      userId: userId,
      dueDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).select('_id title completed xpReward coinReward difficulty');

    res.json(tasks);
  } catch (error) {
    console.error('Error getting today\'s tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task completion status
const updateTaskCompletion = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.taskId;
    const { completed } = req.body;

    // Find the task and verify ownership
    const task = await Task.findOne({ _id: taskId, userId: userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Prevent uncompleting tasks - once completed, they stay completed
    if (task.completed && !completed) {
      return res.status(400).json({ message: 'Cannot uncomplete a task. Once completed, tasks remain completed.' });
    }

    // Only allow completing tasks
    if (!completed) {
      return res.status(400).json({ message: 'Can only complete tasks, not uncomplete them.' });
    }

    // Task is being completed
    if (!task.completed) {
      task.completed = true;
      task.completedAt = new Date();
      
      // Award XP and coins to user
      const xpResult = await awardXP(userId, task.xpReward, User);
      
      // Update user's coins
      await User.findByIdAndUpdate(userId, {
        $inc: { 
          totalTasksCompleted: 1,
          coins: task.coinReward
        }
      });

      await task.save();

      res.json({
        task: {
          id: task._id,
          title: task.title,
          completed: task.completed,
          xpReward: task.xpReward,
          coinReward: task.coinReward,
          difficulty: task.difficulty
        },
        userStats: {
          xp: xpResult.currentXP,
          coins: xpResult.coinsEarned + task.coinReward,
          level: xpResult.newLevel,
          leveledUp: xpResult.leveledUp
        }
      });
    } else {
      // Task is already completed
      res.json({
        task: {
          id: task._id,
          title: task.title,
          completed: task.completed,
          xpReward: task.xpReward,
          coinReward: task.coinReward,
          difficulty: task.difficulty
        },
        message: 'Task is already completed'
      });
    }
  } catch (error) {
    console.error('Error updating task completion:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate sample daily tasks for new users
const generateSampleTasks = async (userId) => {
  const sampleTasks = [
    {
      userId: userId,
      title: "Morning Exercise",
      difficulty: "epic",
      dueDate: new Date()
    },
    {
      userId: userId,
      title: "Read 30 minutes",
      difficulty: "rare",
      dueDate: new Date()
    },
    {
      userId: userId,
      title: "Drink 8 glasses of water",
      difficulty: "common",
      dueDate: new Date()
    },
    {
      userId: userId,
      title: "Practice coding",
      difficulty: "epic",
      dueDate: new Date()
    },
    {
      userId: userId,
      title: "Meditate for 10 minutes",
      difficulty: "common",
      dueDate: new Date()
    }
  ];

  try {
    await Task.insertMany(sampleTasks);
  } catch (error) {
    console.error('Error generating sample tasks:', error);
  }
};

module.exports = {
  getDashboardStats,
  getUserProfile,
  getTodayTasks,
  updateTaskCompletion,
  generateSampleTasks
}; 