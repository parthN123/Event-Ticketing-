const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Import controllers (these would need to be implemented)
const { getUsers, getEvents, getSystemStats } = require("../controllers/adminController");

// Admin routes - all require authentication and admin role
router.get("/users", authMiddleware, roleMiddleware(['admin']), getUsers);
router.get("/events", authMiddleware, roleMiddleware(['admin']), getEvents);
router.get("/stats", authMiddleware, roleMiddleware(['admin']), getSystemStats);

module.exports = router;