import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const getAuthToken = authService.getAuthToken;
export const clearAuthData = authService.clearAuthData;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const token = authService.getAuthToken();
    
    if (currentUser && token) {
      setUser(currentUser);
    } else if (currentUser || token) {
      authService.clearAuthData();
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if ((e.key === 'user' || e.key === 'token') && !e.newValue) {
        authService.clearAuthData();
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const intervalId = setInterval(() => {
      const currentUser = authService.getCurrentUser();
      const token = authService.getAuthToken();
      
      if (user && (!currentUser || !token)) {
        authService.clearAuthData();
        setUser(null);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [user]);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const register = async (farmName, email, password) => {
    const result = await authService.register(farmName, email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
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
