import apiClient, { API_ENDPOINTS } from '../config/api';

/**
 * Get farmer profile
 * @returns {Promise<object>} Profile data
 */
export const getProfile = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.farmers.profile);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Update farmer profile
 * @param {object} payload - Profile data to update
 * @returns {Promise<object>} Updated profile data
 */
export const updateProfile = async (payload) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.farmers.profile, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Upload profile picture
 * @param {File} file - Image file to upload
 * @returns {Promise<object>} Response with avatarUrl
 */
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await apiClient.post(
      API_ENDPOINTS.farmers.uploadPicture,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

export default {
  getProfile,
  updateProfile,
  uploadAvatar,
};

