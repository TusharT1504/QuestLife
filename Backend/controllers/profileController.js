const User = require('../models/userModel');
const Task = require('../models/taskModel');
const UserInventory = require('../models/userInventoryModel');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user statistics
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, completed: true });
    const totalXP = await Task.aggregate([
      { $match: { userId: user._id, completed: true } },
      { $group: { _id: null, total: { $sum: '$xpReward' } } }
    ]);
    const totalCoins = await Task.aggregate([
      { $match: { userId: user._id, completed: true } },
      { $group: { _id: null, total: { $sum: '$coinReward' } } }
    ]);

    // Get equipped items
    const equippedItems = await UserInventory.find({ userId, isEquipped: true })
      .populate('itemId');

    const profile = {
      ...user.toObject(),
      stats: {
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        totalXP: totalXP.length > 0 ? totalXP[0].total : 0,
        totalCoins: totalCoins.length > 0 ? totalCoins[0].total : 0
      },
      equippedItems
    };

    res.json(profile);

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, motivation } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (motivation) updateData.motivation = motivation;

    // Check if username or email already exists
    if (username || email) {
      const existingUser = await User.findOne({
        $or: [
          { username: username || '' },
          { email: email || '' }
        ],
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

// Get user achievements
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    const completedTasks = await Task.find({ userId, completed: true });

    const achievements = [];

    // Level achievements
    if (user.level >= 5) achievements.push({ name: 'Rising Star', description: 'Reached level 5', unlocked: true });
    if (user.level >= 10) achievements.push({ name: 'Habit Master', description: 'Reached level 10', unlocked: true });
    if (user.level >= 25) achievements.push({ name: 'Legend', description: 'Reached level 25', unlocked: true });

    // Streak achievements
    if (user.streak >= 7) achievements.push({ name: 'Week Warrior', description: '7-day streak', unlocked: true });
    if (user.streak >= 30) achievements.push({ name: 'Monthly Master', description: '30-day streak', unlocked: true });
    if (user.streak >= 100) achievements.push({ name: 'Century Champion', description: '100-day streak', unlocked: true });

    // Task completion achievements
    if (completedTasks.length >= 10) achievements.push({ name: 'Task Taker', description: 'Completed 10 tasks', unlocked: true });
    if (completedTasks.length >= 50) achievements.push({ name: 'Task Champion', description: 'Completed 50 tasks', unlocked: true });
    if (completedTasks.length >= 100) achievements.push({ name: 'Task Legend', description: 'Completed 100 tasks', unlocked: true });

    // XP achievements
    const totalXP = completedTasks.reduce((sum, task) => sum + task.xpReward, 0);
    if (totalXP >= 1000) achievements.push({ name: 'XP Collector', description: 'Earned 1000 XP', unlocked: true });
    if (totalXP >= 5000) achievements.push({ name: 'XP Master', description: 'Earned 5000 XP', unlocked: true });

    res.json(achievements);

  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ message: 'Error fetching achievements' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserAchievements
}; 