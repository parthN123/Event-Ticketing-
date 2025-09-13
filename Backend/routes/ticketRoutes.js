const express = require("express");
const { body } = require("express-validator");
const {
  bookTicket,
  cancelTicket,
  getMyTickets,
  getTicketById,
  getTicketsByUserId
} = require("../controllers/ticketController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Book tickets
router.post(
  "/",
  authMiddleware,
  [
    body("eventId").notEmpty().withMessage("Event ID required"),
    body("seats").isInt({ min: 1 }).withMessage("At least 1 seat required")
  ],
  bookTicket
);

// Get tickets for logged-in user
router.get("/my-tickets", authMiddleware, getMyTickets);

// Get specific ticket - allow public access for QR code scanning
router.get("/:id", getTicketById);

// Cancel ticket (single implementation)
router.post(
  "/cancel",
  authMiddleware,
  [
    body("ticketId").notEmpty().withMessage("Ticket ID required")
  ],
  cancelTicket
);

// Get tickets by user ID (admin or the user themselves)
router.get('/user/:id', authMiddleware, getTicketsByUserId);

// Admin-only routes would go here
// router.get("/admin/all", authMiddleware, roleMiddleware(['admin']), getAllTickets);

module.exports = router;