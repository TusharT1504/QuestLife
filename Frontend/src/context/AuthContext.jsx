import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('https://questlife.onrender.com/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        await fetchUserProfile();
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setIsAuthenticated(true);
      await fetchUserProfile();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const data = await authService.signup(userData);
      setIsAuthenticated(true);
      await fetchUserProfile();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Allow components to update user (e.g., after profile edit, coin/xp change)
  const updateUser = (newUser) => {
    setUser((prev) => ({ ...prev, ...newUser }));
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    updateUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};