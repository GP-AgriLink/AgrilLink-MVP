import React from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiFileText,
  FiTag,
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import InputField from "./InputField";

const ProfileForm = ({ profile, isEditing, onProfileUpdate }) => {
  const renderValue = (value, defaultText = "Not provided") => {
    return value || defaultText;
  };

  const renderSection = (title, fields) => (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-4">{fields}</div>
    </div>
  );

  const personalInfoSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FiUser className="mr-2" />
            First Name
          </label>
          <p className="text-gray-900">{renderValue(profile.firstName)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FiUser className="mr-2" />
            Last Name
          </label>
          <p className="text-gray-900">{renderValue(profile.lastName)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FiMail className="mr-2" />
            Email
          </label>
          <p className="text-gray-900">{renderValue(profile.email)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FiPhone className="mr-2" />
            Phone Number
          </label>
          <p className="text-gray-900">{renderValue(profile.phoneNumber)}</p>
        </div>
      </div>
    </>
  );

  const farmInfoSection = (
    <>
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
          <FiBriefcase className="mr-2 text-emerald-600" />
          Farm Name
        </label>
        <p className="text-gray-900 text-lg font-medium">
          {renderValue(profile.farmName)}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-gray-600 mb-2 flex items-center">
              <FiFileText className="mr-2 text-emerald-600" />
              Farm Bio
            </label>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {renderValue(profile.farmBio, "No bio provided")}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
              <FiTag className="mr-2 text-emerald-600" />
              Specialties
            </label>
            <p className="text-gray-900">
              {profile.specialties && profile.specialties.length > 0
                ? profile.specialties.join(", ")
                : "No specialties listed"}
            </p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 flex items-center">
            <FiMapPin className="mr-2 text-emerald-600" />
            Location
          </label>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <MapContainer
              center={profile.location?.coordinates || [51.505, -0.09]}
              zoom={15}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
              keyboard={false}
              boxZoom={false}
              attributionControl={false}
              style={{ pointerEvents: "none" }}
              className="h-[280px] w-full z-10 relative pointer-events-none"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={profile.location?.coordinates || [51.505, -0.09]}
                icon={L.icon({
                  iconUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                  shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {renderSection("Personal Information", personalInfoSection)}
      {renderSection("Farm Information", farmInfoSection)}
    </div>
  );
};

export default ProfileForm;
