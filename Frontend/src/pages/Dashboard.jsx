"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { dashboardService } from "../services/dashboardService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoins } from "@fortawesome/free-solid-svg-icons"

const Dashboard = () => {
  const { isAuthenticated } = useAuth()
  const [userStats, setUserStats] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [todayTasks, setTodayTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError("")

        const [stats, profile, tasks] = await Promise.all([
          dashboardService.getUserStats(),
          dashboardService.getUserProfile(),
          dashboardService.getTodayTasks(),
        ])

        setUserStats(stats)
        setUserProfile(profile)

        // Sort tasks by creation date (newest first)
        const sortedTasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        setTodayTasks(sortedTasks)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error("Dashboard data error:", err)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated])

  const handleTaskToggle = async (taskId) => {
    try {
      console.log("Toggling task with ID:", taskId)
      const currentTask = todayTasks.find((task) => task.id === taskId)
      if (!currentTask) {
        console.error("Task not found with ID:", taskId)
        return
      }

      if (currentTask.completed) {
        console.log("Task is already completed, cannot uncomplete")
        return
      }

      console.log("Completing task:", { taskId })
      const response = await dashboardService.updateTaskCompletion(taskId, true)

      setTodayTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))

      if (response.userStats) {
        setUserStats((prevStats) => ({
          ...prevStats,
          xp: response.userStats.xp,
          coins: response.userStats.coins,
          level: response.userStats.level,
        }))
      }

      if (response.userStats?.leveledUp) {
        alert(`🎉 Congratulations! You've reached level ${response.userStats.level}!`)
      }
    } catch (err) {
      console.error("Failed to update task:", err)
      if (err.message?.includes("already completed")) {
        setTodayTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)),
        )
      } else {
        alert("Failed to update task. Please try again.")
      }
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getLevelThreshold = (level) => level * level * 100
  const getPrevLevelThreshold = (level) => (level - 1) * (level - 1) * 100

  const getLevelProgressInfo = () => {
    if (!userStats) return { current: 0, needed: 1, percent: 0 }
    const level = userStats.level
    const xp = userStats.xp
    const prevLevelXP = getPrevLevelThreshold(level)
    const nextLevelXP = getLevelThreshold(level)
    const xpInLevel = xp - prevLevelXP
    const xpNeeded = nextLevelXP - prevLevelXP
    const percent = Math.max(0, Math.min(100, (xpInLevel / xpNeeded) * 100))
    return { current: Math.max(0, xpInLevel), needed: xpNeeded, percent }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to view your dashboard</h1>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const rarityColors = {
    common: "border-gray-300 bg-gray-50",
    rare: "border-blue-300 bg-blue-50",
    epic: "border-purple-300 bg-purple-50",
    legendary: "border-yellow-300 bg-yellow-50",
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {getGreeting()}, {userProfile?.username}
          </h1>
          <p className="text-gray-600">{userProfile?.motivation}</p>
        </div>

        {/* Level Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span className="font-medium">Level {userStats?.level}</span>
            <span>
              {getLevelProgressInfo().current} / {getLevelProgressInfo().needed} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gray-800 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getLevelProgressInfo().percent}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks - Main Focus */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Tasks</h2>
              {todayTasks.filter(task => !task.completed).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No active tasks for today. Great job! 🎉</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {todayTasks.filter(task => !task.completed).map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-6 rounded-2xl transition-all duration-200 
                          border-l-4 ${
                            task.difficulty === "common"
                              ? "border-l-gray-400 bg-gray-50/50"
                              : task.difficulty === "rare"
                                ? "border-l-blue-400 bg-blue-50/50"
                                : task.difficulty === "epic"
                                  ? "border-l-purple-400 bg-purple-50/50"
                                  : "border-l-yellow-400 bg-yellow-50/50"
                          } shadow-sm hover:shadow-md`}
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => !task.completed && handleTaskToggle(task.id)}
                            disabled={task.completed || loading}
                            className={`h-5 w-5 border-gray-300 rounded-full focus:ring-gray-800 focus:ring-2 ${
                              task.completed ? "text-green-600 bg-green-100 cursor-not-allowed" : "text-gray-800"
                            }`}
                          />
                          <div>
                            <span
                              className={`font-medium text-lg ${
                                task.completed ? "line-through text-gray-500" : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </span>
                            <div className="flex items-center space-x-3 mt-2">
                              <span
                                className={`text-xs px-3 py-1 rounded-full font-medium ${
                                  task.difficulty === "common"
                                    ? "bg-gray-100/80 text-gray-700 border border-gray-300"
                                    : task.difficulty === "rare"
                                      ? "bg-blue-100/80 text-blue-700 border border-blue-300"
                                      : task.difficulty === "epic"
                                        ? "bg-purple-100/80 text-purple-700 border border-purple-300"
                                        : "bg-yellow-100/80 text-yellow-700 border border-yellow-300"
                                }`}
                              >
                                {task.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-lg font-medium">+{task.xpReward} XP</span>
                          <span className="text-sm bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg font-medium flex items-center">
                            +{task.coinReward} <FontAwesomeIcon icon={faCoins} className="ml-1" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        Active: {todayTasks.filter((task) => !task.completed).length} | Completed: {todayTasks.filter((task) => task.completed).length}
                      </span>
                      <span className="text-green-600 font-medium">
                        Total XP:{" "}
                        {todayTasks.filter((task) => task.completed).reduce((sum, task) => sum + task.xpReward, 0)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Completed Tasks Section */}
            {todayTasks.filter(task => task.completed).length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">🎉 Completed Tasks</h2>
                <div className="space-y-4">
                  {todayTasks.filter(task => task.completed).map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-6 rounded-2xl border transition-all duration-200 ${
                        task.difficulty === "common"
                          ? "bg-gray-50 border-gray-300"
                          : task.difficulty === "rare"
                            ? "bg-blue-50 border-blue-300"
                            : task.difficulty === "epic"
                              ? "bg-purple-50 border-purple-300"
                              : "bg-yellow-50 border-yellow-300"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className={`text-lg ${
                          task.difficulty === "common"
                            ? "text-gray-500"
                            : task.difficulty === "rare"
                              ? "text-blue-600"
                              : task.difficulty === "epic"
                                ? "text-purple-600"
                                : "text-yellow-600"
                        }`}>✓</span>
                        <div>
                          <span className="font-medium text-lg line-through text-gray-600">
                            {task.title}
                          </span>
                          <div className="flex items-center space-x-3 mt-2">
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${
                                task.difficulty === "common"
                                  ? "bg-gray-100 text-gray-700 border border-gray-300"
                                  : task.difficulty === "rare"
                                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                                    : task.difficulty === "epic"
                                      ? "bg-purple-100 text-purple-700 border border-purple-300"
                                      : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                              }`}
                            >
                              {task.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-green-600 font-medium">+{task.xpReward} XP</span>
                        <span className="text-sm text-yellow-600 font-medium flex items-center">+{task.coinReward} <FontAwesomeIcon icon={faCoins} className="ml-1" /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats - Compact Sidebar */}
          <div className="space-y-6">
            {/* Level */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Level</div>
                <div className="text-3xl font-semibold text-gray-900">{userStats?.level}</div>
              </div>
            </div>

            {/* XP */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Total XP</div>
                <div className="text-3xl font-semibold text-gray-900">{userStats?.xp}</div>
              </div>
            </div>

            {/* Coins */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Coins</div>
                <div className="text-2xl font-bold mb-1 flex items-center justify-center">{userStats?.coins}</div>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Day Streak</div>
                <div className="text-3xl font-semibold text-gray-900">{userStats?.streak}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
