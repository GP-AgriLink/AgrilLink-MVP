import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import avatarPlaceholder from "../assets/avatar-placeholder.svg";
import { Camera, X } from "lucide-react";

const REDIRECT_DELAY = 1000;
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
  validateEgyptianPhone,
} from "../utils/validation";

const NAME_REGEX = /^[a-zA-Z\u0621-\u064A\s'-]{3,50}$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;
const FARM_NAME_REGEX = /^(?!\s*$).{3,}$/;
const FARM_BIO_REGEX = /^[\s\S]{10,500}$/;

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
  const [selectedPosition, setSelectedPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setSelectedPosition([lat, lng]);
      setMarker([lat, lng]);
    },
  });

  useEffect(() => {
    if (selectedPosition) {
      const [lat, lng] = selectedPosition;
      setFormData((prev) => ({
        ...prev,
        location: { type: "Point", coordinates: [lat, lng] },
      }));
    }
  }, [selectedPosition, setFormData]);

  return marker ? <Marker position={marker} /> : null;
}


function FlyToLocation({ coordinates }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, 13, { duration: 1.2 });
    }
  }, [coordinates, map]);
  return null;
}

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

const getDefaultErrors = () => ({
  firstName: "",
  lastName: "",
  farmName: "",
  phoneNumber: "",
  farmBio: "",
});

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getDefaultFormData());
  const [formErrors, setFormErrors] = useState(getDefaultErrors());
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

  const validateField = (name, value) => {
    let error = "";
    const trimmedValue = value?.trim();

    switch (name) {
      case "firstName":
      case "lastName":
        if (!trimmedValue) {
          return "";
        }
        if (trimmedValue.length < 2) {
          error = "Name must be at least 2 characters";
        } else if (trimmedValue.length > 50) {
          error = "Name exceeds maximum length (50 characters)";
        } else if (!/^[A-Za-z\s'-]+$/.test(trimmedValue)) {
          error = "Name can only contain letters, spaces, hyphens, and apostrophes";
        }
        break;
      case "farmName":
        if (!trimmedValue) {
          return "";
        }
        if (trimmedValue.length < 3) {
          error = "Farm name must be at least 3 characters";
        } else if (trimmedValue.length > 100) {
          error = "Farm name exceeds maximum length (100 characters)";
        } else if (!/^[A-Za-z\s'-]+$/.test(trimmedValue)) {
          error = "Farm name can only contain letters, spaces, hyphens, and apostrophes";
        }
        break;
      case "phoneNumber":
        if (!trimmedValue) {
          return "";
        }
        if (!validateEgyptianPhone(trimmedValue)) {
          error = "Please enter a valid Egyptian mobile number (e.g., 01012345678)";
        }
        break;
      case "farmBio":
        if (!trimmedValue) {
          return "";
        }
        if (trimmedValue.length < 10) {
          error = "Bio must be at least 10 characters";
        } else if (trimmedValue.length > 1000) {
          error = "Bio exceeds maximum length (1000 characters)";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const isFormValid = () => {
    const requiredFields = ["firstName", "lastName", "farmName", "phoneNumber", "farmBio"];

    const hasErrors = Object.values(formErrors).some((error) => error.length > 0);
    const isAnyFieldEmpty = requiredFields.some((field) => !formData[field]?.trim());
    const hasMinimumSpecialties = formData.specialties.length > 0;

    return !hasErrors && !isAnyFieldEmpty && hasMinimumSpecialties;
  };


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = getAuthToken();

        if (!token) {
          toast.error("Please log in to edit your profile");
          clearAuthData();
          navigate("/login");
          return;
        }

        const data = await getProfile();

        if (data) {
          const initialData = {
            ...getDefaultFormData(),
            ...data,
            location: data.location || getDefaultFormData().location,
            specialties: Array.isArray(data.specialties) ? data.specialties : [],
          };

          Object.keys(initialData).forEach(key => {
            if (initialData[key] === null || initialData[key] === undefined) {
              initialData[key] = "";
            }
          });

          setFormData(initialData);

          const initialErrors = {};
          Object.keys(getDefaultErrors()).forEach(key => {
            initialErrors[key] = validateField(key, initialData[key]);
          });
          setFormErrors(initialErrors);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again");
          clearAuthData();
          navigate("/login");
        } else {
          toast.error("Failed to load profile data");
        }
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };


  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
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

    if (!isFormValid()) {
      toast.error("Please fill all required fields correctly");
      const allErrors = {};
      Object.keys(getDefaultErrors()).forEach(key => {
        allErrors[key] = validateField(key, formData[key]);
      });
      setFormErrors(allErrors);
      return;
    }

    setIsLoading(true);

    let sanitizedData = null;

    try {
      const token = getAuthToken();

      if (!token) {
        toast.error("Session expired. Please log in again");
        clearAuthData();
        navigate("/login");
        return;
      }

      sanitizedData = {
        firstName: sanitizeName(formData.firstName || ''),
        lastName: sanitizeName(formData.lastName || ''),
        farmName: sanitizeName(formData.farmName || ''),
        phoneNumber: sanitizePhone(formData.phoneNumber || ''),
        farmBio: sanitizeTextArea(formData.farmBio || ''),
        specialties: sanitizeArray(formData.specialties),
        avatarUrl: formData.avatarUrl,
      };

      if (sanitizedData.phoneNumber) {
        const cleanedPhone = sanitizedData.phoneNumber.replace(/[\s-]/g, '');
        sanitizedData.phoneNumber = cleanedPhone.startsWith('0') 
          ? `+20${cleanedPhone.substring(1)}`
          : `+20${cleanedPhone}`;
      }

      if (formData.location?.coordinates) {
        const coordValidation = validateCoordinates(formData.location.coordinates);
        if (coordValidation.valid) {
          sanitizedData.location = { coordinates: coordValidation.sanitized };
        } else {
          toast.warning("Invalid location coordinates. Using default location");
          sanitizedData.location = { coordinates: coordValidation.sanitized };
        }
      }

      console.log("Sending profile update:", sanitizedData);

      const updatedProfile = await updateProfile(sanitizedData);
      console.log("Profile updated:", updatedProfile);

      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/dashboard", { state: { activeView: "profile" } });
      }, REDIRECT_DELAY);
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Error response:", error.response?.data);
      console.error("Sanitized data sent:", sanitizedData);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again");
        clearAuthData();
        navigate("/login");
      } else {
        const errorMsg = error.response?.data?.message || "Failed to update profile. Please try again";
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
      const clickOutsideHandler = (e) => {
        if (
          locationInputRef.current &&
          !locationInputRef.current.contains(e.target) &&
          !document.querySelector(".leaflet-container")?.contains(e.target)
        ) {
          setShowMap(false);
        }
      };

      document.addEventListener("click", clickOutsideHandler);

      return () => {
        document.removeEventListener("click", clickOutsideHandler);
      }
    }
  }, []);

  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg outline-none transition duration-300 relative";
    const hasError = formErrors[fieldName];
    const isEmpty = !formData[fieldName]?.trim();
    const isRequired = ["firstName", "lastName", "farmName", "phoneNumber", "farmBio"].includes(fieldName);

    const isValid = !hasError && !isEmpty;

    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-2 focus:ring-red-500`;
    } else if (isValid) {
      return `${baseClasses} border-emerald-500 focus:ring-2 focus:ring-emerald-500 shadow-md shadow-emerald-500/10`;
    } else {
      return `${baseClasses} border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`;
    }
  };

  const ValidationStatus = ({ fieldName }) => {
    const error = formErrors[fieldName];
    const value = formData[fieldName]?.trim();
    const isRequired = ["firstName", "lastName", "farmName", "phoneNumber", "farmBio"].includes(fieldName);

    if (error) {
      return <p className="text-red-500 text-xs mt-1 transition-opacity duration-300">{error}</p>;
    }

    if (!value && isRequired) {
      return <p className="text-gray-500 text-xs mt-1">Required field</p>;
    }

    return null;
  };

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
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png" || avatarPlaceholder
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
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={getInputClasses("firstName")}
                />
                <ValidationStatus fieldName="firstName" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={getInputClasses("lastName")}
                />
                <ValidationStatus fieldName="lastName" />
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
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  placeholder="01012345678"
                  className={getInputClasses("phoneNumber")}
                />
                <ValidationStatus fieldName="phoneNumber" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName || ""}
                  onChange={handleChange}
                  placeholder="Enter your farm name"
                  className={getInputClasses("farmName")}
                />
                <ValidationStatus fieldName="farmName" />
              </div>

              {/* --- specialties --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialties (max 3)
                  {formData.specialties.length === 0 && (
                    <span className="text-red-500 text-xs ml-2"> (Required)</span>
                  )}
                </label>
                <div className="relative">
                  <select
                    onChange={(e) => handleAddSpecialty(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${formData.specialties.length === 0 ? 'border-red-500' : 'border-gray-300'}`}
                    value=""
                  >
                    <option value="" disabled>Select a specialty</option>
                    {allSpecialties.map((spec) => (
                      <option
                        key={spec}
                        value={spec}
                        disabled={formData.specialties.includes(spec)}
                      >
                        {spec}
                      </option>
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
                  value={formData.farmBio || ""}
                  onChange={handleChange}
                  placeholder="Tell us about your farm (10-1000 characters)..."
                  rows={3}
                  className={getInputClasses("farmBio") + " resize-none"}
                ></textarea>
                <ValidationStatus fieldName="farmBio" />
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
                      ? `Lat: ${formData.location.coordinates[0].toFixed(4)}, Lng: ${formData.location.coordinates[1].toFixed(4)}`
                      : "Click to select location on map"
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition cursor-pointer"
                />
                <p className="text-gray-500 text-xs mt-1">Click the input to select your farm location on the map</p>

                <div
                  className={`mt-3 overflow-hidden transition-all duration-500 ease-in-out ${showMap
                    ? "opacity-100 scale-100 max-h-[320px]"
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
                disabled={isLoading || !isFormValid()}
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