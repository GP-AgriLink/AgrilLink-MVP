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
    updateStatus: (orderId) => `/api/orders/${orderId}/status`,
    base: '/api/orders',
  },
  products: {
    list: '/api/products',
    create: '/api/products',
    update: '/api/products',
    base: '/api/products',
  },
};

const REQUEST_TIMEOUT = 10000;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: REQUEST_TIMEOUT,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const isModifyingRequest = config.method === 'post' || config.method === 'put';
    const isJsonContent = config.headers['Content-Type'] === 'application/json';
    const skipSanitization = config.headers['X-Skip-Sanitization'] === 'true';
    
    if (isModifyingRequest && config.data && isJsonContent && !skipSanitization) {
      config.data = sanitizeFormData(config.data);
    }

    // Clean up internal headers
    delete config.headers['X-Skip-Sanitization'];

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('Authentication failed: Session expired or invalid token');
      clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      console.error('Authorization failed: Access forbidden');
    }

    if (status && status >= 500) {
      console.error('Server error:', error.response?.data || 'Internal server error');
    }

    if (!error.response) {
      console.error('Network error: Unable to reach server');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
