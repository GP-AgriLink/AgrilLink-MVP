/**
 * @file authMiddleware.js
 * @description Middleware to protect routes by verifying a JWT.
 */
import jwt from "jsonwebtoken";
import Farmer from "../models/Farmer.js";

/**
 * Middleware function that checks for a valid JWT in the Authorization header.
 * If valid, it decodes the payload, finds the associated farmer, and attaches
 * the farmer object to the request (`req.farmer`) for use in subsequent controllers.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for "Bearer <token>" in the Authorization header.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token string.
      token = req.headers.authorization.split(" ")[1];

      // Verify the token's signature and expiration.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the farmer by the ID from the token's payload.
      // .select('-password') prevents the hashed password from being returned.
      req.farmer = await Farmer.findById(decoded.id).select("-password");

      // Proceed to the next middleware or the route's controller.
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token is found in the header, deny access.
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect };
