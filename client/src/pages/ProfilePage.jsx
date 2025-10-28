import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileForm from "../components/Profile/ProfileForm";
import AvatarUpload from "../components/Profile/AvatarUpload";
import LocationPicker from "../components/Map/LocationPicker";
import FlyToLocation from "../components/Map/FlyToLocation";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    farmName: "",
    phoneNumber: "",
    farmBio: "",
    location: {
      coordinates: [51.505, -0.09], // Default coordinates (London)
    },
    specialties: [],
    avatarUrl: "",
  });

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
      const token = localStorage.getItem("token");
      console.log("Token found:", token ? "Yes" : "No");

      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Making API request...");
      const response = await axios.get(
        "http://localhost:5000/api/farmers/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Raw API Response:", response.data);

      if (response.data) {
        // Create a safe version of the response data
        const safeData = typeof response.data === "object" ? response.data : {};

        // Initialize profile data with default values
        const profileData = {
          id: "",
          firstName: "",
          lastName: "",
          email: safeData.email || "",
          farmName: "",
          phoneNumber: "",
          farmBio: "",
          location: {
            coordinates: safeData.location?.coordinates || [51.505, -0.09],
          },
          specialties: [],
          avatarUrl: "",
        };

        // Safely copy over any existing values
        Object.keys(profileData).forEach((key) => {
          if (typeof safeData[key] === "string") {
            profileData[key] = safeData[key];
          } else if (key === "specialties" && Array.isArray(safeData[key])) {
            profileData[key] = safeData[key].filter(
              (item) => typeof item === "string"
            );
          }
        });

        console.log("Sanitized Profile Data:", profileData);
        setProfile(profileData);
        setImagePreview(profileData.avatarUrl || "");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      console.log("Response data:", err.response?.data);
      console.log("Profile state:", profile);
      setError(err.response?.data?.message || "Failed to fetch profile");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
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
