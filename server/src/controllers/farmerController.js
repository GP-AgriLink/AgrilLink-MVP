const Farmer = require("../models/Farmer.js");
const generateToken = require("../utils/generateToken.js");

// @desc    Register a new farmer
// @route   POST /api/farmers/register
const registerFarmer = async (req, res) => {
  const { farmName, email, password } = req.body;

  const farmerExists = await Farmer.findOne({ email });

  if (farmerExists) {
    res.status(400);
    throw new Error("Farmer already exists");
  }

  const farmer = await Farmer.create({
    farmName,
    email,
    password,
  });

  if (farmer) {
    res.status(201).json({
      _id: farmer._id,
      farmName: farmer.farmName,
      email: farmer.email,
      token: generateToken(farmer._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid farmer data");
  }
};

// @desc    Auth farmer & get token
// @route   POST /api/farmers/login
const loginFarmer = async (req, res) => {
  const { email, password } = req.body;

  const farmer = await Farmer.findOne({ email });

  if (farmer && (await farmer.matchPassword(password))) {
    res.json({
      _id: farmer._id,
      farmName: farmer.farmName,
      email: farmer.email,
      token: generateToken(farmer._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

module.exports = { registerFarmer, loginFarmer };
