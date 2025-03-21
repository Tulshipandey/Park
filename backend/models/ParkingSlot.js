const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema(
  {
    slotNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ["available", "occupied"], default: "available" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { collection: "parkingSlots" } // Explicit collection name
);

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);
