// API base URL - update this to match your backend URL
const API_BASE_URL = 'https://questlife.onrender.com/api';

// JWT token management
export const getToken = () => {
  return localStorage.getItem('jwt_token');
};

export const setToken = (token) => {
  localStorage.setItem('jwt_token', token);
};

export const removeToken = () => {
  localStorage.removeItem('jwt_token');
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// API request helper with JWT token
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
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

// Authentication API calls
export const authAPI = {
  // Signup
  signup: async (userData) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Logout (optional - for backend cleanup)
  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Even if logout fails, we still remove the token locally
      console.warn('Logout API call failed:', error);
    }
    removeToken();
  },
};

// Form validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};