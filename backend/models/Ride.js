const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // User who requested the ride
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }, // Driver assigned to the ride (nullable until assigned)
  pickupLocation: {
    type: String,
    required: true,
  }, // Start location
  dropoffLocation: {
    type: String,
    required: true,
  }, // End location
  distance: {
    type: Number,
    required: true,
    min: 0.1
  }, // Distance between pickup and dropoff in kilometers
  baseFare: {
    type: Number,
    default: 50,
  }, // Base fare for the ride
  surgeMultiplier: {
    type: Number,
    default: 1,
  }, // Surge pricing multiplier
  totalFare: {
    type: Number,
    required: true,
  }, // Total fare after calculations
  status: {
    type: String,
    enum: ["pending", "ongoing", "completed", "cancelled"],
    default: "pending",
  }, // Ride status
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Ride creation timestamp
  completedAt: {
    type: Date,
  }, // Timestamp when the ride was completed
  rating: {
    type: Number,
    min: 1,
    max: 5,
  }, // User rating for the ride
  pooling: {
    enabled: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users sharing the ride
},
});

// Export the schema as the Ride model
module.exports = mongoose.model("Ride", RideSchema);
