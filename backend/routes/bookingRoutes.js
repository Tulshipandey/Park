const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const Ride = require("../models/Ride");
const { getUpcomingRides, requestSharedRide } = require("../controllers/bookingController");



// Create a new booking (supports pooling)
router.post("/", async (req, res) => {
    try {
        const { userId, pickupLocation, dropoffLocation, rideType, scheduledTime, pooling } = req.body;

        let assignedBooking = null;

        if (pooling) {
            // Check if there is an existing shared ride available
            assignedBooking = await Booking.findOne({
                pickupLocation,
                dropoffLocation,
                rideType,
                status: "pending",
                pooling: true,
                passengers: { $lt: 4 } // Max 4 passengers per shared ride
            });

            if (assignedBooking) {
                // Add the user to existing shared ride
                assignedBooking.passengers.push(userId);
                await assignedBooking.save();
            }
        }

        if (!assignedBooking) {
            // Create a new booking if no shared ride is found
            assignedBooking = new Booking({
                userId,
                pickupLocation,
                dropoffLocation,
                rideType,
                scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
                pooling,
                passengers: pooling ? [userId] : []
            });

            await assignedBooking.save();
        }

        res.status(201).json({ message: "Booking created successfully!", booking: assignedBooking });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Get upcoming scheduled rides
router.get("/scheduled/:userId", getUpcomingRides);

// Cancel a scheduled ride
router.put("/cancel/:bookingId", async (req, res) => {
    try {
        const { bookingId } = req.params;

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: "cancelled" },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking cancelled successfully", booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling booking", error });
    }
});


// Request a Shared Ride
router.post("/pool", bookingController.requestSharedRide);



module.exports = router;
