const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Protected routes - require authentication
router.get("/profile", authenticateToken, userController.getProfile);
router.put("/profile", authenticateToken, userController.updateProfile);
router.put("/password", authenticateToken, userController.updatePassword);

module.exports = router;
