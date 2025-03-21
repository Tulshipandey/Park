const express = require("express");
const Ride = require("../models/Ride");
const router = express.Router();
const calculateDynamicFare = require("../utils/pricing");

router.post("/", async (req, res) => {
    try {
        const { userId, pickupLocation, dropoffLocation, distance, demand, traffic } = req.body;

        // 🕒 Check Peak Hour (8-10 AM, 6-9 PM)
        const currentHour = new Date().getHours();
        const isPeakHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 18 && currentHour <= 21);

        // 🏷️ **Calculate Dynamic Fare**
        const { totalFare, surgeMultiplier } = calculateDynamicFare(distance, demand, traffic, isPeakHour);

        const newRide = new Ride({
            userId,
            pickupLocation,
            dropoffLocation,
            distance,
            totalFare,
            surgeMultiplier
        });

        await newRide.save();
        res.status(201).json({ message: "Ride booked successfully!", ride: newRide });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
// Driver updating location
router.put("/update-location/:rideId", async (req, res) => {
    try {
        const { rideId } = req.params;
        const { currentLocation } = req.body;

        const ride = await Ride.findByIdAndUpdate(
            rideId,
            { currentLocation },
            { new: true }
        );

        if (!ride) return res.status(404).json({ message: "Ride not found" });

        res.status(200).json({ message: "Location updated", ride });
    } catch (error) {
        res.status(500).json({ message: "Error updating location", error });
    }
});

// Start ride
router.put("/start/:rideId", async (req, res) => {
    try {
        const { rideId } = req.params;

        const ride = await Ride.findByIdAndUpdate(
            rideId,
            { status: "ongoing", startTime: new Date() },
            { new: true }
        );

        if (!ride) return res.status(404).json({ message: "Ride not found" });

        res.status(200).json({ message: "Ride started", ride });
    } catch (error) {
        res.status(500).json({ message: "Error starting ride", error });
    }
});

// End ride
router.put("/end/:rideId", async (req, res) => {
    try {
        const { rideId } = req.params;

        const ride = await Ride.findByIdAndUpdate(
            rideId,
            { status: "completed", endTime: new Date() },
            { new: true }
        );

        if (!ride) return res.status(404).json({ message: "Ride not found" });

        res.status(200).json({ message: "Ride completed", ride });
    } catch (error) {
        res.status(500).json({ message: "Error completing ride", error });
    }
});

// Get user's active ride
router.get("/active/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const activeRide = await Ride.findOne({
            userId,
            status: { $in: ["pending", "ongoing"] }
        });

        if (!activeRide) return res.status(404).json({ message: "No active ride found" });

        res.status(200).json(activeRide);
    } catch (error) {
        res.status(500).json({ message: "Error fetching active ride", error });
    }
});

// Driver accepts a ride
router.put("/accept/:rideId", async (req, res) => {
    try {
        const { rideId } = req.params;
        const { driverId } = req.body;

        const ride = await Ride.findByIdAndUpdate(
            rideId,
            { status: "ongoing", driverId },
            { new: true }
        );

        if (!ride) return res.status(404).json({ message: "Ride not found" });

        res.status(200).json({ message: "Ride accepted by driver", ride });
    } catch (error) {
        res.status(500).json({ message: "Error accepting ride", error });
    }
});


module.exports = router;
