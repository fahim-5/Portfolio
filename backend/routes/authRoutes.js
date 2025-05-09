const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Login route
router.post("/login", authController.login);

// Password reset routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
