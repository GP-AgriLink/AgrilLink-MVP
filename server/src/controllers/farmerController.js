/**
 * @file farmerController.js
 * @description Contains the business logic for handling all requests related to farmers,
 * including registration, login, and profile management.
 */
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

// Export all controller functions to be used in the routes file.
export { registerFarmer, loginFarmer, getFarmerProfile, updateFarmerProfile };
