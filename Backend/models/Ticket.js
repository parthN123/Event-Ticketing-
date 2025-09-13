const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seats: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    enum: ["confirmed", "cancelled", "refunded"], 
    default: "confirmed" 
  },
  qrCode: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to generate QR code
ticketSchema.pre('save', function(next) {
  if (this.isNew || !this.qrCode) {
    this.qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${this._id}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);