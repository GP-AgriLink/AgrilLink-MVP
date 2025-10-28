import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Add auth token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
