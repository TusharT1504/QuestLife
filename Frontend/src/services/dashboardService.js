import { authService } from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

// API request helper with authentication
const apiRequest = async (endpoint, options = {}) => {
  const token = authService.getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Dashboard service functions
export const dashboardService = {
  // Get user stats (XP, Level, Coins, Streak)
  async getUserStats() {
    return await apiRequest('/dashboard/stats');
  },

  // Get today's tasks
  async getTodayTasks() {
    const tasks = await apiRequest('/dashboard/tasks/today');
    // Normalize task data for frontend (map _id to id)
    return tasks.map(task => ({
      ...task,
      id: task._id
    }));
  },

  // Update task completion status
  async updateTaskCompletion(taskId, completed) {
    return await apiRequest(`/dashboard/tasks/${taskId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    });
  },

  // Get user profile with motivation
  async getUserProfile() {
    return await apiRequest('/dashboard/profile');
  },
}; 