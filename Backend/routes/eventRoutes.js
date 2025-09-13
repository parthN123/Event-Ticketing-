const express = require("express");
const { body, validationResult } = require("express-validator");
const { 
  createEvent, 
  getEvents, 
  getMyEvents, 
  getEventStats, 
  getRecommendedEvents,
  updateEvent,
  getEventById,
  deleteEvent,
  getEventsByCategory,
  getDashboardData
} = require("../controllers/eventController");
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules for event creation
const eventValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("date").isISO8601().withMessage("Invalid date format"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("time").notEmpty().withMessage("Time is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("ticketPrice").isFloat({ gt: 0 }).withMessage("Ticket price must be a positive number"),
  body("totalSeats").isInt({ gt: 0 }).withMessage("Total seats must be a positive integer"),
];

// Public routes
router.get('/', getEvents);
router.get('/recommended', getRecommendedEvents);
router.get('/category/:category', getEventsByCategory);

// Protected routes
router.use(protect);

// Specific routes (must come before parameter routes)
router.get('/my-events', getMyEvents);
router.get('/stats', authorize('organizer', 'admin'), getEventStats);
router.get('/admin/dashboard', authorize('admin'), getDashboardData);

// Event creation route
router.post('/', authorize('organizer', 'admin'), eventValidationRules, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, createEvent);

// Event ID routes (must be last)
router.get('/:id', getEventById);
router.put('/:id', authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', authorize('organizer', 'admin'), deleteEvent);

module.exports = router;