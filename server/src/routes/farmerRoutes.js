const express = require("express");
const { body } = require("express-validator");
const {
  registerFarmer,
  loginFarmer,
  getFarmerProfile,
} = require("../controllers/farmerController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// --- Public Routes ---

// @route   POST /api/farmers/register
router.post(
  "/register",
  // Validation middleware
  [
    body("farmName", "Farm name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  registerFarmer
);

// @route   POST /api/farmers/login
router.post(
  "/login",
  // Validation middleware
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  loginFarmer
);

// --- Private Routes ---

// @route   GET /api/farmers/profile
// The 'protect' middleware runs first. If the token is valid, it calls getFarmerProfile.
router.get("/profile", protect, getFarmerProfile);

module.exports = router;
