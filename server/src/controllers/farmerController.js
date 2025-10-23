const { validationResult } = require("express-validator");
const Farmer = require("../models/Farmer.js");
const generateToken = require("../utils/generateToken.js");

/**
 * @desc    Register a new farmer
 * @route   POST /api/farmers/register
 * @access  Public
 */
const registerFarmer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 1. Destructure the new fields from the request body
  const {
    firstName,
    lastName,
    phoneNumber,
    farmName,
    email,
    password,
    specialties,
  } = req.body;

  try {
    const farmerExists = await Farmer.findOne({ email });
    if (farmerExists) {
      return res.status(400).json({ message: "Farmer already exists" });
    }

    const farmer = await Farmer.create({
      firstName,
      lastName,
      phoneNumber,
      farmName,
      email,
      password,
      specialties,
    });

    res.status(201).json({
      _id: farmer._id,
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      phoneNumber: farmer.phoneNumber,
      farmName: farmer.farmName,
      email: farmer.email,
      specialties: farmer.specialties,
      token: generateToken(farmer._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Authenticate a farmer and get a token
 * @route   POST /api/farmers/login
 * @access  Public
 */
const loginFarmer = async (req, res) => {
  // 1. Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 2. Find the farmer by email
    const farmer = await Farmer.findOne({ email });

    // 3. If farmer exists and password matches, send back data and token
    if (farmer && (await farmer.matchPassword(password))) {
      res.json({
        _id: farmer._id,
        farmName: farmer.farmName,
        email: farmer.email,
        token: generateToken(farmer._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Get the logged-in farmer's profile
 * @route   GET /api/farmers/profile
 * @access  Private
 */
const getFarmerProfile = async (req, res) => {
  // The protect middleware has already found the farmer and attached it to req.farmer
  const farmer = req.farmer;

  if (farmer) {
    res.json({
      _id: farmer._id,
      farmName: farmer.farmName,
      email: farmer.email,
      specialties: farmer.specialties,
    });
  } else {
    res.status(404).json({ message: "Farmer not found" });
  }
};

module.exports = { registerFarmer, loginFarmer, getFarmerProfile };
