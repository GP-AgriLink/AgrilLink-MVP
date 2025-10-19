const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT.
 * @param {string} id - The MongoDB document _id to embed in the token.
 * @returns {string} - The signed JSON Web Token.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token will expire in 30 days
  });
};

module.exports = generateToken;
