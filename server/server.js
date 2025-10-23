// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db.js");
const farmerRoutes = require("./src/routes/farmerRoutes.js");

// Load environment variables from .env file
dotenv.config();

// Establish the database connection
connectDB();

// Initialize the Express application
const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());
app.use(cors());
// --- API Routes ---
// Mount the farmer-related routes under the '/api/farmers' prefix
app.use("/api/farmers", farmerRoutes);

// A simple test route to confirm the server is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
