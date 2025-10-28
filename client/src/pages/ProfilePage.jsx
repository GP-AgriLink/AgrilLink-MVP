import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileForm from "../components/Profile/ProfileForm";
import AvatarUpload from "../components/Profile/AvatarUpload";
import LocationPicker from "../components/Map/LocationPicker";
import FlyToLocation from "../components/Map/FlyToLocation";
import { getProfile } from "../services/profileApi";
import { getAuthToken, clearAuthData } from "../context/AuthContext";

// Default profile structure
const getDefaultProfile = () => ({
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  farmName: "",
  phoneNumber: "",
  farmBio: "",
  location: {
    type: "Point",
    coordinates: [30.0444, 31.2357], // Default to Cairo, Egypt
  },
  specialties: [],
  avatarUrl: "",
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getDefaultProfile());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Starting profile fetch...");
      const token = getAuthToken();
      console.log("Token found:", token ? "Yes" : "No");

      if (!token) {
        console.log("No token found, redirecting to login");
        clearAuthData();
        navigate("/login");
        return;
      }

      console.log("Making API request...");
      const data = await getProfile();
      console.log("Raw API Response:", data);

      if (data) {
        // Merge API data with default profile structure
        const profileData = {
          ...getDefaultProfile(),
          ...data,
          location: data.location || getDefaultProfile().location,
          specialties: Array.isArray(data.specialties) ? data.specialties : [],
        };

        console.log("Processed Profile Data:", profileData);
        setProfile(profileData);
        setImagePreview(profileData.avatarUrl || "");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      const errorMsg = err.response?.data?.message || "Failed to fetch profile";
      setError(errorMsg);
      
      // If unauthorized, clear data and redirect
      if (err.response?.status === 401) {
        clearAuthData();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    navigate("/edit-profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader isEditing={false} onEditClick={handleEditClick} />
        <div className="p-6 md:p-8">
          <div className="mb-8 flex justify-center">
            <AvatarUpload
              profilePicture={profile.avatarUrl}
              imagePreview={imagePreview}
              isEditing={false}
              onPreviewChange={setImagePreview}
              onProfileChange={(updatedProfile) =>
                setProfile((prev) => ({ ...prev, ...updatedProfile }))
              }
            />
          </div>
          <ProfileForm profile={profile} isEditing={false} />

          {/* Map Section */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
