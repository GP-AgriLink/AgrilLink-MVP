import axios from "axios";
import { getAuthToken, clearAuthData } from "../context/AuthContext";
import { sanitizeFormData } from "../utils/validation";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// Add auth token to every request if it exists
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Sanitize request data for POST and PUT requests
  if ((config.method === 'post' || config.method === 'put') && config.data) {
    if (config.headers['Content-Type'] === 'application/json') {
      config.data = sanitizeFormData(config.data);
    }
  }
  
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      clearAuthData();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getProfile = async () => {
  try {
    const res = await api.get("/farmers/profile");
    return res.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (payload) => {
  // Data will be sanitized by the request interceptor
  const res = await api.put("/farmers/profile", payload);
  return res.data;
};

export const uploadAvatar = async (file) => {
  const form = new FormData();
  form.append("profilePicture", file);
  const res = await api.post("/farmers/profile/upload-picture", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export default api;
