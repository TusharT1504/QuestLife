const API_BASE_URL = 'https://questlife.onrender.com/api';

// Token management
const getToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('jwt_token');
};

const setToken = (token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('jwt_token', token);
};

const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('jwt_token');
};

// API request helper
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

// Authentication functions
export const authService = {
  // Signup
  async signup(userData) {
    const { username, email, password } = userData;
    
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    if (data.token) {
      setToken(data.token);
    }

    return data;
  },

  // Login
  async login(credentials) {
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      setToken(data.token);
    }

    return data;
  },

  // Logout
  logout() {
    removeToken();
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!getToken();
  },

  // Get current token
  getToken,
};