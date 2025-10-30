import axios from 'axios';
import { getAuthToken, clearAuthData } from '../services/authService';
import { sanitizeFormData } from '../utils/validation';

export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/farmers/login',
    register: '/api/farmers/register',
    forgotPassword: '/api/farmers/forgot-password',
    resetPassword: '/api/farmers/reset-password',
  },
  farmers: {
    profile: '/api/farmers/profile',
    uploadPicture: '/api/farmers/profile/upload-picture',
  },
  orders: {
    myOrders: '/api/orders/myorders',
    create: '/api/orders',
    update: '/api/orders',
  },
  products: {
    list: '/api/products',
    create: '/api/products',
    update: '/api/products',
  },
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if ((config.method === 'post' || config.method === 'put') && config.data) {
      if (config.headers['Content-Type'] === 'application/json') {
        config.data = sanitizeFormData(config.data);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or invalid token');
      clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
