const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Configure Nodemailer transporter (replace with your actual email service details)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.NODE_ENV === "production", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Book a ticket
exports.bookTicket = async (req, res) => {
  const { eventId, seats } = req.body;

  // Validate input
  if (!eventId || !seats || seats < 1) {
    return res.status(400).json({ 
      message: "Please provide valid event ID and at least 1 seat" 
    });
  }

  try {
    // 1. Find event and check availability
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableSeats < seats) {
      return res.status(400).json({ 
        message: `Only ${event.availableSeats} seats remaining` 
      });
    }

    // 2. Reserve seats (transaction recommended for production)
    event.availableSeats -= seats;
    await event.save();

    // 3. Create ticket
    const ticket = new Ticket({
      event: eventId,
      user: req.user.id,
      seats,
      status: "confirmed",
    });
    
    // Save the ticket to generate the QR code
    await ticket.save();

    // 4. Return ticket with event details
    const ticketWithEvent = await Ticket.findById(ticket._id)
      .populate('event', 'name date time location ticketPrice')
      .populate('user', 'name email');

    // 5. Send confirmation email
    if (ticketWithEvent && ticketWithEvent.user && ticketWithEvent.user.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ticketWithEvent.user.email,
        subject: `Ticket Confirmation for ${ticketWithEvent.event.name}`,
        html: `
          <h1>Ticket Booking Confirmed!</h1>
          <p>Dear ${ticketWithEvent.user.name || 'Customer'},</p>
          <p>Your booking for <strong>${ticketWithEvent.seats}</strong> ticket(s) to <strong>${ticketWithEvent.event.name}</strong> has been confirmed.</p>
          <p><strong>Event:</strong> ${ticketWithEvent.event.name}</p>
          <p><strong>Date:</strong> ${new Date(ticketWithEvent.event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${ticketWithEvent.event.time}</p>
          <p><strong>Location:</strong> ${ticketWithEvent.event.location}</p>
          <p><strong>Total Amount:</strong> $${(ticketWithEvent.event.ticketPrice * ticketWithEvent.seats).toFixed(2)}</p>
          <p><strong>Ticket ID:</strong> ${ticketWithEvent._id}</p>
          <p>You can view your ticket details here: <a href="${process.env.FRONTEND_URL}/tickets/${ticketWithEvent._id}">View Ticket</a></p>
          <p>Thank you for your purchase!</p>
          <p>The Event Ticketing Team</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully!');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    res.status(201).json({
      message: "Booking confirmed",
      ticket: ticketWithEvent
    });

  } catch (err) {
    console.error("Booking error:", err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid event ID format" });
    }
    
    res.status(500).json({ 
      message: "Booking failed",
      error: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};

// Cancel a ticket
exports.cancelTicket = async (req, res) => {
  const { ticketId } = req.body;

  if (!ticketId) {
    return res.status(400).json({ message: "Ticket ID required" });
  }

  try {
    // 1. Find ticket with event details
    const ticket = await Ticket.findById(ticketId)
      .populate('event', 'date availableSeats organizer');

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // 2. Authorization check
    if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Not authorized to cancel this ticket" 
      });
    }

    // 3. Check cancellation policy (24-hour window)
    const eventDate = new Date(ticket.event.date);
    const cancellationDeadline = new Date(eventDate - 24 * 60 * 60 * 1000);
    
    if (new Date() > cancellationDeadline) {
      return res.status(400).json({ 
        message: "Cancellations must be made 24 hours before the event",
        deadline: cancellationDeadline.toISOString()
      });
    }

    // 4. Process cancellation
    ticket.status = "cancelled";
    await ticket.event.updateOne({ 
      $inc: { availableSeats: ticket.seats } 
    });
    await ticket.save();

    // 5. Mock refund processing
    const refundId = `ref_${Date.now()}`;

    res.status(200).json({
      message: "Ticket cancelled successfully",
      refundId,
      releasedSeats: ticket.seats,
      cancellationFee: calculateCancellationFee(ticket.event.date)
    });

  } catch (err) {
    console.error("Cancellation error:", err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ticket ID format" });
    }
    
    res.status(500).json({ 
      message: "Cancellation failed",
      error: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};

// Helper function
function calculateCancellationFee(eventDate) {
  const daysUntilEvent = (new Date(eventDate) - Date.now()) / (1000 * 60 * 60 * 24);
  return daysUntilEvent < 3 ? 150 : 0; // $10 fee if <3 days
}

// Get tickets for the logged-in user
exports.getMyTickets = async (req, res) => {
  try {
    // Find all tickets for the current user
    const tickets = await Ticket.find({ user: req.user.id })
      .populate('event', 'name date time location description category ticketPrice')
      .sort({ createdAt: -1 });
    
    // Generate QR codes for tickets that don't have them
    const updatedTickets = await Promise.all(tickets.map(async (ticket) => {
      try {
        if (!ticket.qrCode) {
          ticket.qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${ticket._id}`;
          await ticket.save();
        }
        return ticket;
      } catch (ticketError) {
        console.error(`Error updating ticket ${ticket._id}:`, ticketError);
        return ticket; // Return the original ticket if update fails
      }
    }));
    
    res.status(200).json(updatedTickets);
  } catch (err) {
    console.error('Error fetching user tickets:', err);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    console.log('Getting ticket by ID:', req.params.id);
    const ticket = await Ticket.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email');

    console.log('Found ticket:', ticket);

    if (!ticket) {
      console.log('Ticket not found');
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // If user is not authenticated, return limited information
    if (!req.user) {
      console.log('User not authenticated, returning limited ticket info');
      const limitedTicket = {
        _id: ticket._id,
        event: {
          name: ticket.event.name,
          date: ticket.event.date,
          time: ticket.event.time,
          location: ticket.event.location,
          description: ticket.event.description,
          category: ticket.event.category,
          ticketPrice: ticket.event.ticketPrice
        },
        seats: ticket.seats,
        status: ticket.status,
        createdAt: ticket.createdAt
      };
      console.log('Returning limited ticket info:', limitedTicket);
      return res.json(limitedTicket);
    }

    // If user is authenticated and is the ticket owner or an admin, return full information
    if (req.user.role === 'admin' || ticket.user._id.toString() === req.user._id.toString()) {
      console.log('User is authorized, returning full ticket info');
      return res.json(ticket);
    }

    // If user is authenticated but not the ticket owner, return limited information
    console.log('User is authenticated but not ticket owner, returning limited info');
    const limitedTicket = {
      _id: ticket._id,
      event: {
        name: ticket.event.name,
        date: ticket.event.date,
        time: ticket.event.time,
        location: ticket.event.location,
        description: ticket.event.description,
        category: ticket.event.category,
        ticketPrice: ticket.event.ticketPrice
      },
      seats: ticket.seats,
      status: ticket.status,
      createdAt: ticket.createdAt
    };
    console.log('Returning limited ticket info:', limitedTicket);
    return res.json(limitedTicket);
  } catch (error) {
    console.error('Error in getTicketById:', error);
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
};

exports.getTicketsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate user ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Check if req.user exists and has an id
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Only allow if the requester is the user or an admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const tickets = await Ticket.find({ user: id })
      .populate('event', 'name date time location description category ticketPrice availableSeats totalSeats')
      .sort({ createdAt: -1 });

    if (!tickets) {
      return res.status(404).json({ message: 'No tickets found for this user' });
    }

    res.status(200).json(tickets);
  } catch (err) {
    console.error('Error fetching tickets by user ID:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};