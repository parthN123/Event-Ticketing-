const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const path = require('path');
const fs = require('fs').promises;

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    console.log('createEvent: received request.');
    console.log('createEvent: req.body:', req.body);
    console.log('createEvent: req.files:', req.files);
    const { name, date, location, ticketPrice, totalSeats, time, description, category } = req.body;
  
    // Validate input
    if (!name || !date || !location || !ticketPrice || !totalSeats || !time || !description || !category) {
      console.log('createEvent: Missing required fields.');
      return res.status(400).json({ message: "All fields are required" });
    }

    // Handle image upload
    let imagePath = null;
    if (req.files && req.files.image) {
      const file = req.files.image;
      console.log(`createEvent: Image file received: ${file.name}, mimetype: ${file.mimetype}, size: ${file.size}`);
      
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(__dirname, '../uploads/events');
      console.log(`createEvent: Ensuring upload directory exists at: ${uploadDir}`);
      await fs.mkdir(uploadDir, { recursive: true });

      // Generate unique filename
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);
      console.log(`createEvent: Attempting to save image to: ${filepath}`);

      // Move file to uploads directory
      try {
        await file.mv(filepath);
        console.log('createEvent: Image saved successfully.');
      } catch (mvError) {
        console.error('createEvent: Error moving image file:', mvError);
        return res.status(500).json({ message: 'Failed to save image file.' });
      }

      // Set image path relative to uploads directory with full URL
      imagePath = `${process.env.BASE_URL || 'http://localhost:5001'}/uploads/events/${filename}`;
      console.log(`createEvent: Image URL to be saved in DB: ${imagePath}`);
    }
  
    // Create a new event
    const event = new Event({
      name,
      date,
      location,
      time,
      description,
      category,
      ticketPrice,
      totalSeats,
      availableSeats: totalSeats,
      organizer: req.user.id,
      image: imagePath
    });
  
    // Save the event to the database
    await event.save();
    console.log('createEvent: Event saved to database with ID:', event._id);
  
    // Return the created event
    res.status(201).json(event);
  } catch (err) {
    console.error('createEvent: Error creating event:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    console.log('getEvents called');
    console.log('User:', req.user ? { id: req.user.id, role: req.user.role } : 'No user');

    let query = {};
    
    // If user is authenticated and is an organizer, only show their events
    if (req.user && req.user.role === 'organizer') {
      query.organizer = req.user.id;
      console.log('Filtering events for organizer:', req.user.id);
    }

    const events = await Event.find(query)
      .populate({
        path: 'organizer',
        select: 'name email role'
      })
      .sort({ date: 1 });

    console.log('Found events:', events.length);

    // Ensure we always return an array, even if empty
    res.status(200).json({
      success: true,
      message: events.length > 0 ? 'Events retrieved successfully' : 'No events found',
      count: events.length,
      events: events || [] // Ensure we always return an array
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching events",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      events: [] // Return empty array on error
    });
  }
};

// Get events created by the logged-in organizer
exports.getMyEvents = async (req, res) => {
  try {
    console.log('getMyEvents called');
    console.log('User ID from request:', req.user?.id);
    console.log('User role:', req.user?.role);
    
    if (!req.user || !req.user.id) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // If user is not an organizer, return empty array with appropriate message
    if (req.user.role !== 'organizer') {
      console.log('User is not an organizer');
      return res.status(200).json({
        message: 'No events found for this user',
        events: []
      });
    }

    // Find events for the organizer
    const events = await Event.find({ organizer: req.user.id })
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    console.log('Found events:', events.length);
    
    res.status(200).json({
      message: events.length > 0 ? 'Events retrieved successfully' : 'No events found',
      events: events
    });
  } catch (err) {
    console.error('Error fetching organizer events:', err);
    res.status(500).json({ 
      message: "Error fetching events",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get event statistics for organizer
exports.getEventStats = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    if (eventId) {
      // Get stats for a specific event
      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Get ticket statistics for this event
      const tickets = await Ticket.find({ event: eventId })
        .populate('user', 'name email')
        .lean();

      const stats = {
        totalTickets: tickets.length,
        soldTickets: tickets.filter(ticket => ticket.status === 'confirmed').length,
        pendingTickets: tickets.filter(ticket => ticket.status === 'pending').length,
        cancelledTickets: tickets.filter(ticket => ticket.status === 'cancelled').length,
        revenue: tickets.reduce((total, ticket) => total + (ticket.price || 0), 0),
        attendees: tickets
          .filter(ticket => ticket.status === 'confirmed')
          .map(ticket => ({
            name: ticket.user?.name || 'Anonymous',
            email: ticket.user?.email || 'No email'
          }))
      };

      return res.json(stats);
    } else {
      // Get overall stats for all events by this organizer
      const events = await Event.find({ organizer: userId });
      const eventIds = events.map(event => event._id);

      // Get all tickets for these events
      const tickets = await Ticket.find({ event: { $in: eventIds } })
        .populate('event', 'name ticketPrice')
        .lean();

      const stats = {
        totalEvents: events.length,
        ticketsSold: tickets.filter(ticket => ticket.status === 'confirmed').length,
        totalRevenue: tickets.reduce((total, ticket) => total + (ticket.seats * ticket.event.ticketPrice), 0),
        events: events.map(event => ({
          id: event._id,
          name: event.name,
          totalSeats: event.totalSeats,
          availableSeats: event.availableSeats,
          ticketsSold: tickets.filter(ticket => 
            ticket.event._id.toString() === event._id.toString() && 
            ticket.status === 'confirmed'
          ).length
        }))
      };

      return res.json(stats);
    }
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({ message: 'Error fetching event statistics' });
  }
};

// Get recommended events for customer
exports.getRecommendedEvents = async (req, res) => {
  try {
    // In a real app, this would use a recommendation algorithm
    // For now, just return upcoming events
    const events = await Event.find()
      .limit(6)
      .sort({ date: 1 });
      
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching recommended events:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    console.log('updateEvent: received request.');
    console.log('updateEvent: req.body:', req.body);
    console.log('updateEvent: req.files:', req.files);

    const { name, date, location, ticketPrice, totalSeats, time, description, category } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      console.log('updateEvent: Event not found.');
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is authorized to update this event
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      console.log('updateEvent: Unauthorized access.');
      return res.status(403).json({ message: "Not authorized to update this event" });
    }

    // Handle image upload
    let imagePath = event.image; // Keep existing image if no new one is uploaded
    if (req.files && req.files.image) {
      const file = req.files.image;
      console.log(`updateEvent: New image file received: ${file.name}, mimetype: ${file.mimetype}, size: ${file.size}`);

      // Delete old image if it exists
      if (event.image) {
        const oldImagePath = path.join(__dirname, '../uploads/events', path.basename(event.image));
        try {
          await fs.unlink(oldImagePath);
          console.log(`updateEvent: Deleted old image: ${oldImagePath}`);
        } catch (unlinkError) {
          console.warn(`updateEvent: Could not delete old image (might not exist or permissions issue): ${unlinkError.message}`);
        }
      }
      
      const uploadDir = path.join(__dirname, '../uploads/events');
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);
      console.log(`updateEvent: Attempting to save new image to: ${filepath}`);

      try {
        await file.mv(filepath);
        console.log('updateEvent: New image saved successfully.');
      } catch (mvError) {
        console.error('updateEvent: Error moving new image file:', mvError);
        return res.status(500).json({ message: 'Failed to save new image file.' });
      }

      imagePath = `${process.env.BASE_URL || 'http://localhost:5001'}/uploads/events/${filename}`;
      console.log(`updateEvent: New image URL to be saved in DB: ${imagePath}`);
    }

    // Update event fields
    event.name = name;
    event.date = date;
    event.location = location;
    event.ticketPrice = ticketPrice;
    event.totalSeats = totalSeats;
    event.time = time;
    event.description = description;
    event.category = category;
    event.image = imagePath;

    // Calculate available seats based on current sold tickets if totalSeats changed
    if (totalSeats !== event.totalSeats) {
      const ticketsSold = await Ticket.countDocuments({ event: event._id, status: 'confirmed' });
      event.availableSeats = totalSeats - ticketsSold;
    }

    await event.save();
    console.log('updateEvent: Event updated in database.');
    res.status(200).json(event);
  } catch (err) {
    console.error('updateEvent: Error updating event:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Basic check if the ID format is plausible for an ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      // Log a warning or handle appropriately if it's not a valid format
      console.warn(`Attempted to fetch event with invalid ID format: ${id}`);
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const event = await Event.findById(id)
      .populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (err) {
    // Log specific error if it's not a CastError, otherwise the invalid format check handles it
    if (err.name !== 'CastError') {
      console.error('Error fetching event:', err);
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Check if user is authorized (admin or organizer)
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }
    
    // Check if there are any tickets for this event
    const ticketCount = await Ticket.countDocuments({ event: req.params.id });
    
    if (ticketCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete event with existing tickets",
        ticketCount
      });
    }
    
    await event.deleteOne();
    
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get events by category
exports.getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const events = await Event.find({ category })
      .sort({ date: 1 });
      
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events by category:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get dashboard data for admin
exports.getDashboardData = async (req, res) => {
  try {
    // Get upcoming events (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingEvents = await Event.find({
      date: { $gte: today, $lte: nextWeek }
    }).sort({ date: 1 }).limit(5);
    
    // Get events with low available seats (less than 20% remaining)
    const lowAvailabilityEvents = await Event.find({
      $expr: {
        $lt: [{ $divide: ["$availableSeats", "$totalSeats"] }, 0.2]
      }
    }).limit(5);
    
    // Get most popular events (by ticket count)
    const popularEvents = await Ticket.aggregate([
      { $group: { _id: "$event", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const popularEventIds = popularEvents.map(item => item._id);
    const popularEventDetails = await Event.find({ _id: { $in: popularEventIds } });
    
    res.status(200).json({
      upcomingEvents,
      lowAvailabilityEvents,
      popularEvents: popularEventDetails.map(event => ({
        ...event.toObject(),
        ticketCount: popularEvents.find(pe => pe._id.toString() === event._id.toString())?.count || 0
      }))
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: "Server error" });
  }
};