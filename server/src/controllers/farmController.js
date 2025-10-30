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

/**
 * @desc    Get farms within a certain radius of a location
 * @route   GET /api/farms/nearby
 * @access  Public
 */
const getNearbyFarms = async (req, res) => {
  // 1. Get the user's location from the query string
  const { longitude, latitude, distance } = req.query;

  // A default distance of 10 kilometers if none is provided
  const maxDistance = distance || 10000; // in meters

  // 2. Validate the input
  if (!longitude || !latitude) {
    return res
      .status(400)
      .json({ message: "Please provide longitude and latitude" });
  }

  try {
    // 3. Construct the geospatial query using $nearSphere
    const farms = await Farmer.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance), // Maximum distance in meters
        },
      },
    }).select("farmName specialties location"); // Only send back public data

    res.json(farms);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export { getAllFarms, getFarmById, getNearbyFarms };
