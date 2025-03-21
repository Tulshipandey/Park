const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    rideType: { type: String, enum: ["cab", "shuttle", "e-rickshaw"], required: true },
    isPooling: { type: Boolean, default: false },  // New field for ride-sharing
    poolGroup: { type: mongoose.Schema.Types.ObjectId, ref: "PoolGroup" }, // Group ID if pooled
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    scheduledTime: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);
