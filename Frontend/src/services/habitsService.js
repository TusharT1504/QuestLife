import { authService } from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

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
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'API error');
  return data;
};

export const habitsService = {
  async getHabits() {
    const data = await apiRequest('/tasks');
    // Normalize id for frontend and ensure all fields are present
    return data.map((t) => ({ 
      ...t, 
      id: t._id,
      difficulty: t.difficulty || 'rare',
      coinReward: t.coinReward || 10
    }));
  },
  async addHabit(habit) {
    return await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(habit),
    });
  },
  async updateHabit(id, habit) {
    return await apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(habit),
    });
  },
  async deleteHabit(id) {
    return await apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
}; 