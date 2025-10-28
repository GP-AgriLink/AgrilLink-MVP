/**
 * @file server.js
 * @description This is the main entry point for the AgriLink backend server.
 * It initializes the Express application, connects to the database,
 * applies essential middleware, and mounts the API routes.
 */

// --- Module Imports ---
import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import farmerRoutes from "./src/routes/farmerRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";
import cors from "cors";

// --- Configuration ---
// Load environment variables from the .env file into process.env
dotenv.config();

// Establish the connection to the MongoDB database
connectDB();

// Initialize the Express application
const app = express();

// To connect with client
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true
}));

// --- Middleware ---
// This middleware is essential for parsing incoming request bodies with JSON payloads.
app.use(express.json());

// --- API Routes ---
// Mount the farmer-related routes. Any request starting with '/api/farmers'
// will be handled by the farmerRoutes router.
app.use("/api/farmers", farmerRoutes);

// A simple test route to confirm that the server is up and running.
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- Error Handling Middleware ---
// Custom middleware to handle 404 Not Found errors.
app.use(notFound);
// Custom middleware to handle all other errors, ensuring a consistent JSON response.
app.use(errorHandler);

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`🚀 Server running on port ${PORT}`));
