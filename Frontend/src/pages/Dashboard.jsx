import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [stats, profile, tasks] = await Promise.all([
          dashboardService.getUserStats(),
          dashboardService.getUserProfile(),
          dashboardService.getTodayTasks()
        ]);

        setUserStats(stats);
        setUserProfile(profile);
        setTodayTasks(tasks);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const handleTaskToggle = async (taskId) => {
    try {
      console.log('Toggling task with ID:', taskId);
      const currentTask = todayTasks.find(task => task.id === taskId);
      if (!currentTask) {
        console.error('Task not found with ID:', taskId);
        return;
      }

      // Prevent toggling if task is already completed
      if (currentTask.completed) {
        console.log('Task is already completed, cannot uncomplete');
        return;
      }

      console.log('Completing task:', { taskId });
      const response = await dashboardService.updateTaskCompletion(taskId, true);

      setTodayTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );

      if (response.userStats) {
        setUserStats(prevStats => ({
          ...prevStats,
          xp: response.userStats.xp,
          coins: response.userStats.coins,
          level: response.userStats.level
        }));
      }

      if (response.userStats?.leveledUp) {
        alert(`🎉 Congratulations! You've reached level ${response.userStats.level}!`);
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      if (err.message?.includes('already completed')) {
        // Task is already completed, just update the UI
        setTodayTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
          )
        );
      } else {
        alert('Failed to update task. Please try again.');
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const calculateXPProgress = () => {
    if (!userStats) return 0;
    
    // Calculate XP required for current level
    const currentLevelXP = Math.pow(userStats.level, 2) * 100;
    
    // Calculate XP required for next level
    const nextLevelXP = Math.pow(userStats.level + 1, 2) * 100;
    
    // Calculate how much XP user has in current level
    const xpInCurrentLevel = userStats.xp - currentLevelXP;
    
    // Calculate XP needed to reach next level
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    
    // Calculate percentage of current level completed (0-100)
    const percentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
    
    // Ensure percentage is between 0 and 100
    return Math.min(100, Math.max(0, percentage));
  };

  const getCurrentLevelXPInfo = () => {
    if (!userStats) return { current: 0, needed: 0 };
    
    // Calculate XP required for current level
    const currentLevelXP = Math.pow(userStats.level, 2) * 100;
    
    // Calculate XP required for next level
    const nextLevelXP = Math.pow(userStats.level + 1, 2) * 100;
    
    // Calculate how much XP user has in current level
    const xpInCurrentLevel = userStats.xp - currentLevelXP;
    
    // Calculate XP needed to reach next level
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    
    return {
      current: Math.max(0, xpInCurrentLevel),
      needed: xpNeededForNextLevel
    };
  };

  const getXPNeededForNextLevel = () => {
    if (!userStats) return 0;
    
    // Calculate XP required for current level
    const currentLevelXP = Math.pow(userStats.level, 2) * 100;
    
    // Calculate XP required for next level
    const nextLevelXP = Math.pow(userStats.level + 1, 2) * 100;
    
    // Calculate how much XP user has in current level
    const xpInCurrentLevel = userStats.xp - currentLevelXP;
    
    // Calculate XP needed to reach next level
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    
    return xpNeededForNextLevel - xpInCurrentLevel;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your dashboard</h1>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {getGreeting()}, {userProfile?.username}
          </h1>
          <p className="text-gray-600 mt-1">{userProfile?.motivation}</p>
        </div>

        {/* Level Progress - Subtle */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Level {userStats?.level}</span>
            <span>{userStats?.xp} XP • {getXPNeededForNextLevel()} XP to next level</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${calculateXPProgress()}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks - Main Focus (70%) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h2>
              {todayTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tasks for today. Great job! 🎉</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {todayTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                          task.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => !task.completed && handleTaskToggle(task.id)}
                            disabled={task.completed || loading}
                            className={`h-4 w-4 border-gray-300 rounded focus:ring-blue-500 ${
                              task.completed 
                                ? 'text-green-600 bg-green-100 cursor-not-allowed' 
                                : 'text-blue-600'
                            }`}
                          />
                          <div>
                            <span className={`font-medium ${
                              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {task.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-green-600 font-medium">
                            +{task.xpReward} XP
                          </span>
                          <span className="text-sm text-yellow-600 font-medium">
                            +{task.coinReward} 🪙
                          </span>
                          {task.completed && (
                            <div className="flex items-center space-x-1">
                              <span className="text-green-500">✓</span>
                              <span className="text-xs text-gray-500">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        Completed: {todayTasks.filter(task => task.completed).length}/{todayTasks.length}
                      </span>
                      <span className="text-green-600 font-medium">
                        Total XP: {todayTasks.filter(task => task.completed).reduce((sum, task) => sum + task.xpReward, 0)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats - Compact Sidebar */}
          <div className="space-y-4">
            {/* Level */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Level</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{userStats?.level}</div>
              </div>
            </div>

            {/* XP */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Total XP</div>
                <div className="text-2xl font-bold text-green-600 mb-1">{userStats?.xp}</div>
              </div>
            </div>

            {/* Coins */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Coins</div>  
                <div className="text-2xl font-bold text-yellow-600 mb-1">{userStats?.coins}</div>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Day Streak</div>
                <div className="text-2xl font-bold text-red-600 mb-1">{userStats?.streak}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 