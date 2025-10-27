/**
 * @file Farmer.js
 * @description Defines the Mongoose schema and model for the Farmer collection.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Defines the schema for a Farmer document, outlining the structure and rules for farmer data.
 */
const farmerSchema = new mongoose.Schema(
  {
    // --- REQUIRED FOR REGISTRATION ---
    farmName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Database index to ensure emails are unique
    },
    password: {
      type: String,
      required: true,
    },

    // --- For Resetting password ---
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    // --- OPTIONAL (added/updated via profile) ---
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    farmBio: { type: String, maxLength: 500 },
    avatarUrl: { type: String },
    specialties: [String], // A multi-valued attribute for farm specialties
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" }, // [longitude, latitude]
    },
  },
  {
    timestamps: true, // Mongoose automatically adds createdAt and updatedAt fields
  }
);

/**
 * Mongoose middleware that runs before a 'save' operation.
 * It automatically hashes the password using bcrypt if the password has been modified.
 * This ensures plain-text passwords are never stored in the database.
 */
farmerSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) {
    return next();
  }
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * A custom method on the Farmer model to compare a plain-text password
 * with the hashed password stored in the database.
 * @param {string} enteredPassword - The plain-text password from the login attempt.
 * @returns {Promise<boolean>} - A promise that resolves to true if passwords match, false otherwise.
 */
farmerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the Farmer model from the schema
const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
