const ParkingSlot = require("../models/ParkingSlot");

// Get all parking slots
const getParkingSlots = async (req, res) => {
  try {
    console.log("Request received for parking slots");
    const slots = await ParkingSlot.find({});
    console.log("Fetched slots:", slots);
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parking slots", error });
  }
};

// Update parking slot status (check-in/check-out)
const updateParkingSlot = async (req, res) => {
  const { slotId } = req.params;
  const { status } = req.body;

  try {
    const slot = await ParkingSlot.findByIdAndUpdate(
      slotId,
      { status, lastUpdated: Date.now() },
      { new: true }
    );

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: "Error updating slot status" });
  }
};

const bookParkingSlot = async (req, res) => {
  const { slotNumber, userId } = req.body;

  try {
    // Check if the parking slot is available
    const slot = await ParkingSlot.findOne({ slotNumber });

    if (!slot) {
      return res.status(404).json({ message: "Parking slot not found" });
    }

    if (slot.status !== "available") {
      return res.status(400).json({ message: "Slot not available" });
    }

    // Update the slot status to occupied
    slot.status = "occupied";
    slot.lastUpdated = new Date();
    await slot.save();

    res.status(200).json({
      message: "Parking slot booked successfully",
      slot
    });
  } catch (error) {
    res.status(500).json({ message: "Error booking parking slot", error });
  }
};

module.exports = { getParkingSlots, updateParkingSlot,bookParkingSlot };
