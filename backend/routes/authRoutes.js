const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController"); // Make sure this exists
const { getUserProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");


// Ensure this function is properly defined in authController.js
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
