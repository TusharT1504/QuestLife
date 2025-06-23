const cron = require('node-cron');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

const resetAllTasks = async () => {
  try {
    console.log('Resetting all tasks at 12:00 PM...');
    
    // Reset all tasks to incomplete
    const result = await Task.updateMany(
      {},
      { 
        completed: false, 
        completedAt: null 
      }
    );
    
    console.log(`Reset ${result.modifiedCount} tasks at 12:00 PM`);
  } catch (error) {
    console.error('Error resetting tasks:', error);
  }
};

// Streak maintenance (check daily at 1:00 AM)
const maintainStreaks = async () => {
  try {
    console.log('Maintaining user streaks...');
    
    const users = await User.find({});
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const user of users) {
      const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
      
      if (lastLogin) {
        lastLogin.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
        
        // If user hasn't logged in for more than 1 day, reset streak
        if (daysDiff > 1) {
          user.streak = 0;
          await user.save();
          console.log(`🔄 Reset streak for user: ${user.username}`);
        }
      }
    }
    
    console.log('Streak maintenance completed');
  } catch (error) {
    console.error('Error maintaining streaks:', error);
  }
};

// Initialize cron jobs
const initCronJobs = () => {
  // Reset all tasks at 12:00 PM (noon) every day
  cron.schedule('0 12 * * *', resetAllTasks, {
    scheduled: true,
    timezone: "UTC"
  });
  
  // Streak maintenance at 1:00 AM daily
  cron.schedule('0 1 * * *', maintainStreaks, {
    scheduled: true,
    timezone: "UTC"
  });
  
  console.log('Cron jobs initialized successfully');
  console.log('Task reset scheduled for 12:00 PM (noon) daily');
};

module.exports = { initCronJobs }; 