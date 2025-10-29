import express from "express";
import { getAllFarms, getFarmById } from "../controllers/farmController.js";
const router = express.Router();

// @route   GET /api/farms
// @desc    Get a list of all farms for the homepage map
// @access  Public
router.get("/", getAllFarms);

// @route   GET /api/farms/:id
// @desc    Get the public profile of a single farm
// @access  Public
router.get("/:id", getFarmById);

export default router;
