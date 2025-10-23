const express = require("express");
const { body } = require("express-validator");
const {
  registerFarmer,
  loginFarmer,
  getFarmerProfile,
  updateFarmerProfile,
} = require("../controllers/farmerController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// --- Public Routes ---

// @route   POST /api/farmers/register
router.post(
  "/register",
  [
    body("firstName", "First name is required").not().isEmpty(),
    body("lastName", "Last name is required").not().isEmpty(),
    body("phoneNumber", "Phone number is required").not().isEmpty(),
    body("location.coordinates", "Location coordinates are required").isArray({
      min: 2,
      max: 2,
    }),
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

// @route   GET or PUT /api/farmers/profile
// The 'protect' middleware runs first. If the token is valid, it calls getFarmerProfile.
router
  .route("/profile")
  // GET request to fetch the profile
  .get(protect, getFarmerProfile)
  // Add the PUT request to update the profile
  .put(
    protect,

    [
      body("firstName", "First name cannot be empty").optional().notEmpty(),
      body("lastName", "Last name cannot be empty").optional().notEmpty(),
      body("farmName", "Farm name cannot be empty").optional().notEmpty(),
      body("phoneNumber", "Phone number cannot be empty").optional().notEmpty(),
      body(
        "location.coordinates",
        "Location coordinates must be an array of 2 numbers"
      )
        .optional()
        .isArray({ min: 2, max: 2 }),
    ],
    updateFarmerProfile
  );

module.exports = router;
