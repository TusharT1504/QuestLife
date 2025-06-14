const cron = require('node-cron');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

// Reset daily tasks every day at 12:00 AM
const resetDailyTasks = async () => {
  try {
    console.log('🔄 Resetting daily tasks...');
    
    // Reset all daily tasks to incomplete
    const result = await Task.updateMany(
      { category: 'daily' },
      { 
        completed: false, 
        completedAt: null 
      }
    );
    
    console.log(`✅ Reset ${result.modifiedCount} daily tasks`);
  } catch (error) {
    console.error('❌ Error resetting daily tasks:', error);
  }
};

// Weekly task reset (every Sunday at 12:00 AM)
const resetWeeklyTasks = async () => {
  try {
    console.log('🔄 Resetting weekly tasks...');
    
    const result = await Task.updateMany(
      { category: 'weekly' },
      { 
        completed: false, 
        completedAt: null 
      }
    );
    
    console.log(`✅ Reset ${result.modifiedCount} weekly tasks`);
  } catch (error) {
    console.error('❌ Error resetting weekly tasks:', error);
  }
};

// Monthly task reset (first day of month at 12:00 AM)
const resetMonthlyTasks = async () => {
  try {
    console.log('🔄 Resetting monthly tasks...');
    
    const result = await Task.updateMany(
      { category: 'monthly' },
      { 
        completed: false, 
        completedAt: null 
      }
    );
    
    console.log(`✅ Reset ${result.modifiedCount} monthly tasks`);
  } catch (error) {
    console.error('❌ Error resetting monthly tasks:', error);
  }
};

// Streak maintenance (check daily at 1:00 AM)
const maintainStreaks = async () => {
  try {
    console.log('🔄 Maintaining user streaks...');
    
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
    
    console.log('✅ Streak maintenance completed');
  } catch (error) {
    console.error('❌ Error maintaining streaks:', error);
  }
};

// Initialize cron jobs
const initCronJobs = () => {
  // Daily task reset at 12:00 AM
  cron.schedule('0 0 * * *', resetDailyTasks, {
    scheduled: true,
    timezone: "UTC"
  });
  
  // Weekly task reset every Sunday at 12:00 AM
  cron.schedule('0 0 * * 0', resetWeeklyTasks, {
    scheduled: true,
    timezone: "UTC"
  });
  
  // Monthly task reset on first day of month at 12:00 AM
  cron.schedule('0 0 1 * *', resetMonthlyTasks, {
    scheduled: true,
    timezone: "UTC"
  });
  
  // Streak maintenance at 1:00 AM daily
  cron.schedule('0 1 * * *', maintainStreaks, {
    scheduled: true,
    timezone: "UTC"
  });
  
  console.log('⏰ Cron jobs initialized successfully');
};

module.exports = { initCronJobs }; 