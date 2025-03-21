const express = require("express");
const { getParkingSlots, updateParkingSlot, bookParkingSlot } = require("../controllers/parkingController");
const router = express.Router();

router.get("/", getParkingSlots);  // Get all parking slots
router.put("/:slotId", updateParkingSlot); // Update a slot's status
router.post("/book", bookParkingSlot);  // Ensure this line exists

module.exports = router;
