import axios from "axios";

const API_BASE_URL = import.meta.env.API_BASE_URL || "http://localhost";
const API_PORT = import.meta.env.PORT || "5000";
const API_URL = `${API_BASE_URL}:${API_PORT}/api/farmers`;

// Register a new farmer
export const registerFarmer = async (farmerData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, farmerData);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      throw error.response.data.errors;
    }

    throw [{msg: "Server error. Please try again later."}];
  }
};
