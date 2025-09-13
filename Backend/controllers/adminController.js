const User = require("../models/User");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");

// Get all users for admin dashboard
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all events for admin dashboard
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get system statistics for admin dashboard
exports.getSystemStats = async (req, res) => {
  try {
    // Get counts and statistics
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'Active' });
    
    // Calculate total revenue from tickets
    const tickets = await Ticket.find();
    const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.price || 0), 0);
    
    // Return all statistics
    res.status(200).json({
      totalUsers,
      totalEvents,
      activeEvents,
      totalRevenue,
      // Add more statistics as needed
    });
  } catch (err) {
    console.error('Error fetching system stats:', err);
    res.status(500).json({ message: "Server error" });
  }
};