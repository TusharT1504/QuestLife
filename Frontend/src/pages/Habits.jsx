"use client"

import { useState, useEffect } from "react"
import { habitsService } from "../services/habitsService"
import { useAuth } from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare,faTrash } from '@fortawesome/free-solid-svg-icons'


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
    difficulty: "common",
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
      difficulty: "common",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (task) => {
    setCurrentTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      difficulty: task.difficulty,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentTask(null)
  }

  const rarityColors = {
    common: "border-gray-300 bg-gray-50",
    rare: "border-blue-300 bg-blue-50",
    epic: "border-purple-300 bg-purple-50",
    legendary: "border-yellow-300 bg-yellow-50",
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "common":
        return "bg-gray-50 text-gray-800 border border-gray-300"
      case "rare":
        return "bg-blue-50 text-blue-800 border border-blue-300"
      case "epic":
        return "bg-purple-50 text-purple-800 border border-purple-300"
      case "legendary":
        return "bg-yellow-50 text-yellow-800 border border-yellow-300"
      default:
        return "bg-gray-50 text-gray-800 border border-gray-300"
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
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors duration-200"
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
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-gray-800 hover:text-gray-900 text-lg font-medium"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-800 hover:text-gray-900 text-lg font-medium"
                    >
                      <FontAwesomeIcon icon={faTrash} />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-900"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-900"
                    >
                      <option value="common">Common</option>
                      <option value="rare">Rare</option>
                      <option value="epic">Epic</option>
                      <option value="legendary">Legendary</option>
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
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors duration-200"
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
