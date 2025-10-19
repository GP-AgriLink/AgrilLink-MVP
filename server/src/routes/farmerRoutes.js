const express = require("express");
const router = express.Router();
const {
  registerFarmer,
  loginFarmer,
} = require("../controllers/farmerController.js");

router.post("/register", registerFarmer);
router.post("/login", loginFarmer);

module.exports = router;
