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

// Helper function to get token from localStorage
export const getAuthToken = () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser);
      return userData.token;
    } catch (error) {
      console.error('Error parsing saved user:', error);
      return null;
    }
  }
  return null;
};

// Helper function to clear all auth data
export const clearAuthData = () => {
  // Remove all possible auth-related keys
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Also remove any other potential auth keys (future-proofing)
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('auth') || key.includes('token') || key.includes('user'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log('All auth data cleared from localStorage');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Verify token exists in user object
        if (userData.token) {
          setUser(userData);
          // Sync standalone token if missing
          if (!savedToken) {
            localStorage.setItem('token', userData.token);
          }
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        clearAuthData();
      }
    } else if (savedToken) {
      // If token exists but user doesn't, clear token
      clearAuthData();
    }
    setLoading(false);
  }, []);

  // Listen for localStorage changes (including manual deletion)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Check if user or token was deleted
      if (e.key === 'user' && !e.newValue) {
        // User was deleted, clear everything
        console.log('User data deleted from localStorage, clearing all auth data');
        clearAuthData();
        setUser(null);
      } else if (e.key === 'token' && !e.newValue) {
        // Token was deleted, clear everything
        console.log('Token deleted from localStorage, clearing all auth data');
        clearAuthData();
        setUser(null);
      }
    };

    // Listen for storage events (fires when localStorage is modified in another tab/window)
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for manual deletions in the same tab
    const intervalId = setInterval(() => {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      
      // If user state exists but localStorage is cleared
      if (user && (!savedUser || !savedToken)) {
        console.log('Auth data manually deleted, clearing state');
        clearAuthData();
        setUser(null);
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [user]);

  // Login function
  const login = async (email, password) => {
    try {
      const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/farmers/login`, {
        email,
        password,
      });

      const userData = response.data;

      // Ensure token exists
      if (!userData.token) {
        throw new Error('No token received from server');
      }

      // Save user to state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token); // Backward compatibility

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
      const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/farmers/register`, {
        farmName,
        email,
        password,
      });

      const userData = response.data;

      // Ensure token exists
      if (!userData.token) {
        throw new Error('No token received from server');
      }

      // Automatically log the user in after registration
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token); // Backward compatibility

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
    console.log('Logging out user...');
    // Clear user state first
    setUser(null);
    // Then clear all localStorage data
    clearAuthData();
    console.log('User logged out successfully');
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
