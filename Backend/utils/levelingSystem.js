// XP and Leveling System Utilities

// Calculate level from total XP
const calculateLevel = (xp) => {
  // Formula: level = 1 + sqrt(xp / 100)
  return Math.floor(1 + Math.sqrt(xp / 100));
};

// Calculate XP needed for next level
const calculateXPForNextLevel = (level) => {
  // Formula: xpForNextLevel = (level^2 - 1) * 100
  return Math.pow(level + 1, 2) * 100;
};

// Calculate XP progress within current level
const calculateXPProgress = (currentXP, level) => {
  const currentLevelXP = Math.pow(level, 2) * 100;
  const nextLevelXP = Math.pow(level + 1, 2) * 100;
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  
  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100));
};

// Award XP to user and check for level up
const awardXP = async (userId, xpAmount, User) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const oldLevel = user.level;
    const newXP = user.xp + xpAmount;
    const newLevel = calculateLevel(newXP);

    // Update user stats
    user.xp = newXP;
    user.level = newLevel;
    
    // Award coins for XP gained (1 coin per 10 XP)
    const coinsEarned = Math.floor(xpAmount / 10);
    user.coins += coinsEarned;

    await user.save();

    return {
      oldLevel,
      newLevel,
      xpGained: xpAmount,
      coinsEarned,
      leveledUp: newLevel > oldLevel,
      currentXP: newXP,
      xpToNextLevel: calculateXPForNextLevel(newLevel)
    };
  } catch (error) {
    throw error;
  }
};

// Get user stats for dashboard
const getUserStats = (user) => {
  const level = user.level;
  const xp = user.xp;
  const xpToNextLevel = calculateXPForNextLevel(level);
  
  return {
    level,
    xp,
    xpToNextLevel,
    coins: user.coins,
    streak: user.streak,
    totalTasksCompleted: user.totalTasksCompleted
  };
};

module.exports = {
  calculateLevel,
  calculateXPForNextLevel,
  calculateXPProgress,
  awardXP,
  getUserStats
}; 