/**
 * @file farmerController.js
 * @description Contains the business logic for handling all requests related to farmers,
 * including registration, login, and profile management.
 */

import crypto from "crypto";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";
import Farmer from "../models/Farmer.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Register a new farmer with minimal required info.
 * @route   POST /api/farmers/register
 * @access  Public
 */
const registerFarmer = async (req, res) => {
  // 1. Check for validation errors defined in the route.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 2. Destructure the essential fields for initial registration.
  const { farmName, email, password } = req.body;

  try {
    // 3. Check if a farmer with the same email already exists in the database.
    const farmerExists = await Farmer.findOne({ email });
    if (farmerExists) {
      return res
        .status(400)
        .json({ message: "Farmer with this email already exists" });
    }

    // 4. Create the new farmer document. The pre-save hook in the Farmer model will automatically hash the password.
    const farmer = await Farmer.create({
      farmName,
      email,
      password,
    });

    // 5. If creation is successful, respond with the new farmer's basic data and a JWT.
    res.status(201).json({
      _id: farmer._id,
      farmName: farmer.farmName,
      email: farmer.email,
      token: generateToken(farmer._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Authenticate a farmer and get a JWT.
 * @route   POST /api/farmers/login
 * @access  Public
 */
const loginFarmer = async (req, res) => {
  // 1. Check for validation errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 2. Find the farmer by their unique email.
    const farmer = await Farmer.findOne({ email });

    // 3. If a farmer is found AND the entered password matches the stored hash, proceed.
    if (farmer && (await farmer.matchPassword(password))) {
      // 4. Respond with the farmer's data and a new JWT.
      res.json({
        _id: farmer._id,
        farmName: farmer.farmName,
        email: farmer.email,
        token: generateToken(farmer._id),
      });
    } else {
      // If no farmer is found or the password does not match, send a generic error.
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Get the logged-in farmer's profile.
 * @route   GET /api/farmers/profile
 * @access  Private (requires a valid JWT)
 */
const getFarmerProfile = async (req, res) => {
  // The 'protect' middleware has already found the farmer from the token
  // and attached it to the request object as 'req.farmer'.
  const farmer = req.farmer;

  if (farmer) {
    // Respond with all relevant profile data. The password is already excluded by the middleware.
    res.json({
      _id: farmer._id,
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      phoneNumber: farmer.phoneNumber,
      farmName: farmer.farmName,
      farmBio: farmer.farmBio,
      avatarUrl: farmer.avatarUrl,
      email: farmer.email,
      specialties: farmer.specialties,
      location: farmer.location,
    });
  } else {
    res.status(404).json({ message: "Farmer not found" });
  }
};

/**
 * @desc    Update a farmer's profile information.
 * @route   PUT /api/farmers/profile
 * @access  Private (requires a valid JWT)
 */
const updateFarmerProfile = async (req, res) => {
  // 1. Check for validation errors for the fields being updated.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 2. Find the farmer from the database using the ID from the token (provided by 'protect' middleware).
  const farmer = await Farmer.findById(req.farmer._id);

  if (farmer) {
    // 3. Update fields only if they are provided in the request body.
    // This allows for partial updates (e.g., changing only the bio).
    farmer.firstName = req.body.firstName || farmer.firstName;
    farmer.lastName = req.body.lastName || farmer.lastName;
    farmer.farmName = req.body.farmName || farmer.farmName;
    farmer.phoneNumber = req.body.phoneNumber || farmer.phoneNumber;
    farmer.farmBio = req.body.farmBio || farmer.farmBio;
    farmer.avatarUrl = req.body.avatarUrl || farmer.avatarUrl;
    farmer.specialties = req.body.specialties || farmer.specialties;
    farmer.location = req.body.location || farmer.location;

    // 4. Save the updated document to the database.
    const updatedFarmer = await farmer.save();

    // 5. Respond with the complete, updated farmer profile.
    res.json({
      _id: updatedFarmer._id,
      firstName: updatedFarmer.firstName,
      lastName: updatedFarmer.lastName,
      phoneNumber: updatedFarmer.phoneNumber,
      farmName: updatedFarmer.farmName,
      farmBio: updatedFarmer.farmBio,
      avatarUrl: updatedFarmer.avatarUrl,
      email: updatedFarmer.email,
      specialties: updatedFarmer.specialties,
      location: updatedFarmer.location,
    });
  } else {
    res.status(404).json({ message: "Farmer not found" });
  }
};

/**
 * @desc    Initiate password reset process
 * @route   POST /api/farmers/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const farmer = await Farmer.findOne({ email });

    if (!farmer) {
      return res
        .status(404)
        .json({ message: "No farmer with that email found." });
    }

    // 1. Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. Hash the token and set it on the farmer model
    farmer.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3. Set an expiration time (e.g., 10 minutes from now)
    farmer.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await farmer.save();

    // 4. Create the reset URL and send the email (configure your email transport)
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;

    // Example using nodemailer (replace with your actual email service)
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or another service
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "AgriLink Support <support@agrilink.com>",
      to: farmer.email,
      subject: "Password Reset Request",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within ten minutes of receiving it:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Token sent to email!" });
  } catch (error) {
    // Invalidate the token on error
    if (req.body.email) {
      const farmer = await Farmer.findOne({ email: req.body.email });
      if (farmer) {
        farmer.passwordResetToken = undefined;
        farmer.passwordResetExpires = undefined;
        await farmer.save();
      }
    }
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
};

/**
 * @desc    Reset password with a valid token
 * @route   PUT /api/farmers/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    // 1. Hash the incoming token from the URL params
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // 2. Find the farmer by the hashed token AND check if it's not expired
    const farmer = await Farmer.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // $gt means "greater than"
    });

    if (!farmer) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired" });
    }

    // 3. Set the new password
    farmer.password = req.body.password;

    // 4. Clear the reset token fields
    farmer.passwordResetToken = undefined;
    farmer.passwordResetExpires = undefined;

    // The pre-save hook will automatically hash the new password
    await farmer.save();

    // 5. Log the user in by sending back a new JWT
    res.status(200).json({
      _id: farmer._id,
      farmName: farmer.farmName,
      email: farmer.email,
      token: generateToken(farmer._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

// Export all controller functions to be used in the routes file.
export {
  registerFarmer,
  loginFarmer,
  getFarmerProfile,
  updateFarmerProfile,
  forgotPassword,
  resetPassword,
};
