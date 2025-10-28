import axios from "axios";
import { sanitizeFormData } from "../utils/validation";

const API_URL = `${import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'}/api/farmers`;

// Register a new farmer
export const registerFarmer = async (farmerData) => {
  try { 
    // Sanitize farmer data before sending
    const sanitizedData = sanitizeFormData(farmerData);
    
    const res = await axios.post(`${API_URL}/register`, sanitizedData);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      throw error.response.data.errors;
    }

    throw [{msg: "Server error. Please try again later."}];
  }
};
