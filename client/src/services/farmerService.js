import apiClient, { API_ENDPOINTS } from '../config/api';

/**
 * Register a new farmer
 * @param {object} farmerData - Farmer registration data
 * @returns {Promise<object>} Registration response with user data and token
 */
export const registerFarmer = async (farmerData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.auth.register, farmerData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      throw error.response.data.errors;
    }
    
    const errorMessage = error.response?.data?.message || 'Server error. Please try again later.';
    throw [{ msg: errorMessage }];
  }
};

export default {
  registerFarmer,
};

