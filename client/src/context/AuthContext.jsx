import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const API_URL = import.meta.env.VITE_APP_API_URL;
      const response = await axios.post(`${API_URL}/api/farmers/login`, {
        email,
        password,
      });

      const userData = response.data;

      // Save user to state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (farmName, email, password) => {
    try {
      const API_URL = import.meta.env.VITE_APP_API_URL;
      const response = await axios.post(`${API_URL}/api/farmers/register`, {
        farmName,
        email,
        password,
      });

      const userData = response.data;

      // Automatically log the user in after registration
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
