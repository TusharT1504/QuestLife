const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getProfile,
} = require("../controllers/authController");
const {
  signupValidation,
  loginValidation,
} = require("../middleware/validators");
const auth = require("../middleware/auth");

router.post("/signup", signupValidation, signup);

router.post("/login", loginValidation, login);

module.exports = router;
