const Task = require('../models/taskModel');

// Get task history grouped by date
const getTaskHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const query = { userId, completed: true };
    
    // Add date range filter if provided
    if (startDate || endDate) {
      query.completedAt = {};
      if (startDate) query.completedAt.$gte = new Date(startDate);
      if (endDate) query.completedAt.$lte = new Date(endDate);
    }

    const tasks = await Task.find(query)
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    // Group tasks by date
    const groupedTasks = tasks.reduce((acc, task) => {
      const date = task.completedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    }, {});

    res.json({
      tasks: groupedTasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalTasks: total
    });

  } catch (error) {
    console.error('Error fetching task history:', error);
    res.status(500).json({ message: 'Error fetching task history' });
  }
};

// Get completed tasks for a specific date
const getCompletedTasksByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId,
      completed: true,
      completedAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ completedAt: -1 });

    res.json(tasks);

  } catch (error) {
    console.error('Error fetching completed tasks by date:', error);
    res.status(500).json({ message: 'Error fetching completed tasks' });
  }
};

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'week' } = req.query;

    let startDate;
    const now = new Date();

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const completedTasks = await Task.find({
      userId,
      completed: true,
      completedAt: { $gte: startDate }
    });

    const stats = {
      totalCompleted: completedTasks.length,
      totalXP: completedTasks.reduce((sum, task) => sum + task.xpReward, 0),
      totalCoins: completedTasks.reduce((sum, task) => sum + task.coinReward, 0),
      byDifficulty: {
        common: completedTasks.filter(task => task.difficulty === 'common').length,
        rare: completedTasks.filter(task => task.difficulty === 'rare').length,
        epic: completedTasks.filter(task => task.difficulty === 'epic').length,
        legendary: completedTasks.filter(task => task.difficulty === 'legendary').length
      }
    };

    res.json(stats);

  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Error fetching task statistics' });
  }
};

module.exports = {
  getTaskHistory,
  getCompletedTasksByDate,
  getTaskStats
}; 