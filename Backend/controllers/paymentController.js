const Payment = require("../models/Payment");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

// Mock payment gateway integration
const processPayment = (amount) => {
  // Simulate a successful payment
  return { success: true, transactionId: `txn_${Math.random().toString(36).substring(7)}` };
};

// Process payment for a ticket
exports.processPayment = async (req, res) => {
  const { eventId, seats } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.availableSeats < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Calculate total amount
    const totalAmount = event.ticketPrice * seats;

    // Mock payment processing
    const paymentResult = processPayment(totalAmount);
    if (!paymentResult.success) {
      return res.status(400).json({ message: "Payment failed" });
    }

    // Update available seats
    event.availableSeats -= seats;
    await event.save();

    // Create payment record
    const payment = new Payment({
      user: req.user.id,
      event: eventId,
      amount: totalAmount,
      status: "success",
      transactionId: paymentResult.transactionId,
    });

    await payment.save();

    // Create ticket
    const ticket = new Ticket({
      event: eventId,
      user: req.user.id,
      seats,
    });

    await ticket.save();

    res.status(201).json({ payment, ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Refund payment for a cancelled ticket
exports.processRefund = async (req, res) => {
  const { ticketId } = req.body;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const payment = await Payment.findOne({ user: req.user.id, event: ticket.event });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Mock refund processing
    const refundResult = { success: true, refundId: `ref_${Math.random().toString(36).substring(7)}` };
    if (!refundResult.success) {
      return res.status(400).json({ message: "Refund failed" });
    }

    // Update ticket status
    ticket.status = "cancelled";
    await ticket.save();

    // Update event available seats
    const event = await Event.findById(ticket.event);
    event.availableSeats += ticket.seats;
    await event.save();

    res.status(200).json({ message: "Refund processed successfully", refundId: refundResult.refundId });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};