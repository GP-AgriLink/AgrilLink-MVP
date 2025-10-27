/**
 * @file farmerRoutes.js
 * @description Defines the API endpoints for farmers, applies validation, and attaches middleware.
 */
import express from "express";
import { body } from "express-validator";
import {
  registerFarmer,
  loginFarmer,
  getFarmerProfile,
  updateFarmerProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/farmerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Public Routes ---

// @route   POST /api/farmers/register
// Handles new farmer registration.
router.post(
  "/register",
  // Validation middleware to sanitize and check required fields.
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
// Handles farmer login.
router.post(
  "/login",
  // Validation middleware.
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  loginFarmer
);

// --- PASSWORD RESET ROUTES ---
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// --- Private Routes ---

// @route   GET & PUT /api/farmers/profile
// This single route handles two different HTTP methods for the same resource.
router
  .route("/profile")
  // The 'protect' middleware runs first. If the token is valid, it calls the controller.
  .get(protect, getFarmerProfile)
  // The PUT request also requires a valid token.
  .put(protect, updateFarmerProfile);

export default router;
