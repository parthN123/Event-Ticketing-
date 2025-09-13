const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String },
});

module.exports = mongoose.model("Event", eventSchema);