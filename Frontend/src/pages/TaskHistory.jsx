"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'

const TaskHistory = () => {
  const { user } = useAuth()
  const [taskHistory, setTaskHistory] = useState({})
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const periods = [
    { id: "week", name: "This Week", days: 7 },
    { id: "month", name: "This Month", days: 30 },
    { id: "year", name: "This Year", days: 365 },
  ]

  const difficultyColors = {
    easy: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    hard: "bg-red-50 text-red-700 border-red-200",
  }

  useEffect(() => {
    fetchTaskHistory()
    fetchStats()
  }, [selectedPeriod, currentPage])

  const fetchTaskHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/history?page=${currentPage}&limit=10&period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      const data = await response.json()
      setTaskHistory(data.tasks)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching task history:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/history/stats?period=${selectedPeriod}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-6">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-3 bg-gray-300 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Task History</h1>
          <p className="text-xl text-gray-600">Track your progress and see how far you've come!</p>
        </div>

        {/* Period Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => {
                  setSelectedPeriod(period.id)
                  setCurrentPage(1)
                }}
                className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period.id
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {period.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Tasks Completed</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats.totalCompleted}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Total XP Earned</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats.totalXP}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Coins Earned</p>
                  <p className="text-3xl font-semibold text-gray-900 flex items-center">{stats.totalCoins}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Completion Rate</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {stats.totalCompleted > 0
                      ? Math.round((stats.totalCompleted / (stats.totalCompleted + 10)) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Difficulty Breakdown */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">By Difficulty</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span className="w-4 h-4 bg-green-400 rounded-full"></span>
                    <span className="text-gray-600">Easy</span>
                  </span>
                  <span className="font-semibold text-gray-900">{stats.byDifficulty.easy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span className="w-4 h-4 bg-yellow-400 rounded-full"></span>
                    <span className="text-gray-600">Medium</span>
                  </span>
                  <span className="font-semibold text-gray-900">{stats.byDifficulty.medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span className="w-4 h-4 bg-red-400 rounded-full"></span>
                    <span className="text-gray-600">Hard</span>
                  </span>
                  <span className="font-semibold text-gray-900">{stats.byDifficulty.hard}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">By Category</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span className="text-xl">📅</span>
                    <span className="text-gray-600">Daily</span>
                  </span>
                  <span className="font-semibold text-gray-900">{stats.byCategory.daily}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span className="text-xl">📊</span>
                    <span className="text-gray-600">Weekly</span>
                  </span>
                  <span className="font-semibold text-gray-900">{stats.byCategory.weekly}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span className="text-xl">📈</span>
                    <span className="text-gray-600">Monthly</span>
                  </span>
                  <span className="font-semibold text-gray-900">{stats.byCategory.monthly}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task History List */}
        <div className="space-y-8">
          {Object.keys(taskHistory).length > 0 ? (
            Object.entries(taskHistory).map(([date, tasks]) => (
              <div key={date} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="bg-gray-800 px-8 py-6">
                  <h3 className="text-lg font-semibold text-white">{formatDate(date)}</h3>
                  <p className="text-gray-300 text-sm">{tasks.length} tasks completed</p>
                </div>
                <div className="p-8">
                  <div className="space-y-6">
                    {tasks.map((task) => (
                      <div key={task._id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                        <div className="flex items-center space-x-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{task.title}</h4>
                            {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                            <div className="flex items-center space-x-3 mt-2 text-sm">
                              <span className="font-medium">{task.xpReward} XP</span>
                              <span className="font-medium flex items-center">{task.coinReward} <FontAwesomeIcon icon={faCoins} className="ml-1 text-yellow-500" /> Coins</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[task.difficulty]}`}>
                                {task.difficulty}
                              </span>
                              <span className="text-xs px-3 py-1 rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                                {task.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mt-1">
                              Completed at {formatTime(task.completedAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6 opacity-50">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No completed tasks yet</h3>
              <p className="text-gray-600">Complete some tasks to see your history here!</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-white border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              <span className="px-6 py-3 bg-white border border-gray-300 rounded-2xl text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-white border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskHistory
