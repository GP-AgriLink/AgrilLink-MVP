const jwt = require("jsonwebtoken");
const Farmer = require("../models/Farmer.js");

/**
 * Middleware to protect routes. Verifies a JWT and attaches the
 * user to the request object.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for the token in the 'Authorization' header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the "Bearer <token>" string
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the farmer by the id from the token's payload
      // and attach the user object to the request (excluding the password)
      req.farmer = await Farmer.findById(decoded.id).select("-password");

      // Proceed to the next middleware or route handler
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token is found, deny access
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
