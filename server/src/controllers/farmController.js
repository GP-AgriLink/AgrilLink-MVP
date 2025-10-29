import Farmer from "../models/Farmer.js";

/**
 * @desc    Get a list of all farms for the homepage map
 * @route   GET /api/farms
 * @access  Public
 */
const getAllFarms = async (req, res) => {
  try {
    // Find all farmers but only select the fields needed for the map.
    // This is efficient and secure as it doesn't expose sensitive info.
    const farms = await Farmer.find({}).select("farmName specialties location");
    res.json(farms);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get the public profile of a single farm by its ID
 * @route   GET /api/farms/:id
 * @access  Public
 */
const getFarmById = async (req, res) => {
  try {
    // Find the farm by the ID from the URL parameter
    const farm = await Farmer.findById(req.params.id)
      // Explicitly exclude the password hash for security
      .select("-password");

    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    res.json(farm);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export { getAllFarms, getFarmById };
