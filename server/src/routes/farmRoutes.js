import express from "express";
import {
  getAllFarms,
  getFarmById,
  getNearbyFarms,
} from "../controllers/farmController.js";
const router = express.Router();

// @route   GET /api/farms/nearby
// @desc    Get farms within a certain radius
// @access  Public
// 2. Add the new route here
router.get("/nearby", getNearbyFarms);

// @route   GET /api/farms
// @desc    Get a list of all farms for the homepage map
// @access  Public
router.get("/", getAllFarms);

// @route   GET /api/farms/:id
// @desc    Get the public profile of a single farm
// @access  Public
router.get("/:id", getFarmById);

export default router;
