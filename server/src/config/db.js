/**
 * @file db.js
 * @description Handles the connection to the MongoDB database using Mongoose.
 */
import mongoose from "mongoose";

/**
 * Asynchronously connects to the MongoDB database using the connection string
 * from the environment variables.
 * If the connection fails, it logs the error and exits the Node.js process.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure code
  }
};

export default connectDB;
