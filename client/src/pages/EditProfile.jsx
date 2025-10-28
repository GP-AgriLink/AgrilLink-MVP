// client/pages/EditProfile.jsx

import { useState, useEffect, useRef } from "react";
import { Camera, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

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

export default function EditProfile() {
  const [formData, setFormData] = useState({
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

  const [showMap, setShowMap] = useState(false);
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
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;

        if (!token) {
          alert("No token found. Please log in again.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/farmers/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data || {};
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          farmName: data.farmName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          farmBio: data.farmBio || "",
          avatarUrl: data.avatarUrl || "",
          specialties: data.specialties || [],
          location: data.location || { type: "Point", coordinates: [30.0444, 31.2357] },
        }));
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecialty = (specialty) => {
    if (!specialty) return;
    if (formData.specialties.includes(specialty)) return;
    if (formData.specialties.length >= 3) {
      alert("You can select up to 3 specialties only!");
      return;
    }
    setFormData({ ...formData, specialties: [...formData.specialties, specialty] });
  };

  const handleRemoveSpecialty = (specialty) => {
    setFormData({ ...formData, specialties: formData.specialties.filter((s) => s !== specialty) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }
      const response = await axios.put(
        "http://localhost:5000/api/farmers/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      console.log("Profile updated:", response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      alert("Failed to update profile. Please try again.");
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
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-emerald-600 hover:to-teal-700 transition-all"
              >

                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
