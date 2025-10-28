import React from "react";
import { FiEdit2 } from "react-icons/fi";

const ProfileHeader = ({ isEditing, onEditClick }) => {
  return (
    <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-full px-6 py-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold text-white">
          My Profile
        </h2>
        <button
          onClick={onEditClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg shadow-sm hover:opacity-95 transition"
        >
          <FiEdit2 />
          <span className="text-sm font-medium">
            {isEditing ? "Cancel" : "Edit Profile"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
