const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Defines the schema for a Farmer document.
 */
const farmerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    farmName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures each farmer has a unique email
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" }, // [longitude, latitude]
    },
    specialties: [String], // A multi-valued attribute for farm specialties
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Mongoose middleware that runs before a 'save' operation.
 * It automatically hashes the password if it has been modified.
 */
farmerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * A custom method on the Farmer model to compare an entered password
 * with the hashed password stored in the database.
 * @param {string} enteredPassword - The plain-text password to compare.
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
 */
farmerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Farmer = mongoose.model("Farmer", farmerSchema);
module.exports = Farmer;
