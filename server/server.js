const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db.js");
const farmerRoutes = require("./src/routes/farmerRoutes.js");

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // To accept JSON data in the body

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Use the farmer routes
app.use("/api/farmers", farmerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
