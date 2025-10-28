// client/pages/EditProfile.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../services/profileApi";
import { getAuthToken, clearAuthData } from "../context/AuthContext";
import {
  sanitizeName,
  sanitizeEmail,
  sanitizePhone,
  sanitizeTextArea,
  sanitizeArray,
  validateCoordinates,
  validateFile,
} from "../utils/validation";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationPicker({ setFormData }) {
  const [marker, setMarker] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker([lat, lng]);
      setFormData((prev) => ({
        ...prev,
        location: { type: "Point", coordinates: [lat, lng] },
      }));
    },
  });

  return marker ? <Marker position={marker} /> : null;
}

function FlyToLocation({ coordinates }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, 13, { duration: 1.2 });
    }
  }, [coordinates]);
  return null;
}

// Default form data structure
const getDefaultFormData = () => ({
  firstName: "",
  lastName: "",
  farmName: "",
  email: "",
  phoneNumber: "",
  farmBio: "",
  avatarUrl: "",
  specialties: [],
  location: { type: "Point", coordinates: [30.0444, 31.2357] },
});

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getDefaultFormData());
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const locationInputRef = useRef(null);

  const allSpecialties = [
    "Organic",
    "Vegetables",
    "Fruits",
    "Herbs",
    "Dairy",
    "Grains",
  ];

  // ✅ Fetch profile data on load
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = getAuthToken();

        if (!token) {
          console.log("No token found, redirecting to login");
          toast.error("Please log in to edit your profile");
          clearAuthData();
          navigate("/login");
          return;
        }

        const data = await getProfile();
        
        if (data) {
          setFormData({
            ...getDefaultFormData(),
            ...data,
            location: data.location || getDefaultFormData().location,
            specialties: Array.isArray(data.specialties) ? data.specialties : [],
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          clearAuthData();
          navigate("/login");
        } else {
          toast.error("Failed to load profile data. Please try again.");
        }
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file before processing
      const validation = validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
      });
      
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecialty = (specialty) => {
    if (!specialty) return;
    
    // Sanitize the specialty name
    const sanitizedSpecialty = sanitizeName(specialty);
    
    if (!sanitizedSpecialty) return;
    if (formData.specialties.includes(sanitizedSpecialty)) return;
    if (formData.specialties.length >= 3) {
      toast.warning("You can select up to 3 specialties only!");
      return;
    }
    setFormData({ ...formData, specialties: [...formData.specialties, sanitizedSpecialty] });
  };

  const handleRemoveSpecialty = (specialty) => {
    setFormData({ ...formData, specialties: formData.specialties.filter((s) => s !== specialty) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error("Session expired. Please log in again.");
        clearAuthData();
        navigate("/login");
        return;
      }

      // Sanitize all input data before submission
      const sanitizedData = {
        firstName: sanitizeName(formData.firstName || ''),
        lastName: sanitizeName(formData.lastName || ''),
        farmName: sanitizeName(formData.farmName || ''),
        phoneNumber: sanitizePhone(formData.phoneNumber || ''),
        farmBio: sanitizeTextArea(formData.farmBio || ''),
        specialties: sanitizeArray(formData.specialties),
        location: formData.location,
        avatarUrl: formData.avatarUrl,
      };
      
      // Validate coordinates
      if (sanitizedData.location?.coordinates) {
        const coordValidation = validateCoordinates(sanitizedData.location.coordinates);
        if (!coordValidation.valid) {
          toast.warning("Invalid location coordinates. Using default location.");
          sanitizedData.location.coordinates = coordValidation.sanitized;
        }
      }

      const updatedProfile = await updateProfile(sanitizedData);
      console.log("Profile updated:", updatedProfile);
      
      // Show success toast
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Redirect to profile page after a short delay
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        clearAuthData();
        navigate("/login");
      } else {
        const errorMsg = error.response?.data?.message || "Failed to update profile. Please try again.";
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const input = locationInputRef.current;
    if (input) {
      input.addEventListener("focus", () => setShowMap(true));
      input.addEventListener("blur", () => setTimeout(() => setShowMap(false), 300));
    }
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8">Edit Profile</h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <img
                src={
                  formData.avatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-100"
              />
              <label className="absolute bottom-0 right-0 bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-full cursor-pointer hover:from-emerald-600 hover:to-teal-700 transition shadow-lg">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* --- basic info --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="Enter your farm name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* --- specialties --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialties (max 3)</label>
                <div className="relative">
                  <select
                    onChange={(e) => handleAddSpecialty(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  >
                    <option value="">Select a specialty</option>
                    {allSpecialties.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialty(spec)}
                          className="text-emerald-700 hover:text-red-500 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Farm Bio and Location --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Bio</label>
                <textarea
                  name="farmBio"
                  value={formData.farmBio}
                  onChange={handleChange}
                  placeholder="Tell us about your farm..."
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                ></textarea>
              </div>

              {/* --- location --- */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>

                <input
                  ref={locationInputRef}
                  type="text"
                  readOnly
                  value={
                    formData.location?.coordinates
                      ? `${formData.location.coordinates[0]}, ${formData.location.coordinates[1]}`
                      : ""
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />

                <div
                  className={`mt-3 overflow-hidden transition-all duration-500 ease-in-out ${showMap
                    ? "opacity-100 scale-100 max-h-80"
                    : "opacity-0 scale-95 max-h-0 pointer-events-none"
                    }`}
                >
                  <MapContainer
                    center={formData.location.coordinates}
                    zoom={13}
                    scrollWheelZoom={true}
                    zoomAnimation={true}
                    className="h-80 w-full rounded-lg z-10 relative"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LocationPicker setFormData={setFormData} />
                    <FlyToLocation coordinates={formData.location.coordinates} />

                    {formData.location?.coordinates && (
                      <Marker
                        position={formData.location.coordinates}
                        icon={L.icon({
                          iconUrl:
                            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                          shadowUrl:
                            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                        })}
                      />
                    )}
                  </MapContainer>


                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
