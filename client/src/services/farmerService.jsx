import axios from "axios";

const API_URL = "http://localhost:5000/api/farmers"; // غيّر البورت حسب سيرفرك

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
