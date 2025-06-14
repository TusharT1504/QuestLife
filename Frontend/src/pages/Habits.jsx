"use client"

import { useState, useEffect } from "react"
import { habitsService } from "../services/habitsService"
import { useAuth } from "../context/AuthContext"

const Habits = () => {
  const { isAuthenticated } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    category: "daily",
    priority: "medium",
  })

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        setError("")
        const fetchedTasks = await habitsService.getHabits()
        setTasks(fetchedTasks)
      } catch (err) {
        setError("Failed to fetch tasks.")
        console.error("Error fetching tasks:", err)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchTasks()
    }
  }, [isAuthenticated])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      if (currentTask) {
        // Edit existing task
        await habitsService.updateHabit(currentTask.id, formData)
        setTasks(tasks.map(task =>
          task.id === currentTask.id ? { ...task, ...formData } : task
        ))
      } else {
        // Create new task
        const newTask = await habitsService.addHabit(formData)
        setTasks([...tasks, newTask])
      }
      closeModal()
    } catch (err) {
      setError("Failed to save task.")
      console.error("Error saving task:", err)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await habitsService.deleteHabit(taskId)
        setTasks(tasks.filter(task => task.id !== taskId))
      } catch (err) {
        setError("Failed to delete task.")
        console.error("Error deleting task:", err)
      }
    }
  }

  const openCreateModal = () => {
    setCurrentTask(null)
    setFormData({
      title: "",
      description: "",
      difficulty: "easy",
      category: "daily",
      priority: "medium",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (task) => {
    setCurrentTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      difficulty: task.difficulty,
      category: task.category,
      priority: task.priority,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentTask(null)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to manage your habits</h1>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Habits</h1>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
          >
            Add New Habit
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500 py-8">
            <p>No habits added yet. Click 'Add New Habit' to get started!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border bg-blue-100 text-blue-800 border-blue-200`}>
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create/Edit Task Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentTask ? "Edit Habit" : "Create New Habit"}
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                  >
                    {currentTask ? "Save Changes" : "Add Habit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Habits
