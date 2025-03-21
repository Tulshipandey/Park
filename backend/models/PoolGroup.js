const mongoose = require("mongoose");

const PoolGroupSchema = new mongoose.Schema({
    rideType: { type: String, enum: ["cab", "shuttle"], required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users in pool
    maxCapacity: { type: Number, required: true },
    status: { type: String, enum: ["open", "full", "completed"], default: "open" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PoolGroup", PoolGroupSchema);
