const Ride = require("../models/Ride");

// Create a new ride
exports.createRide = async (req, res) => {
    try {
        const { userId, pickupLocation, dropoffLocation, rideType, scheduledTime } = req.body;

        const newRide = new Ride({
            userId,
            pickupLocation,
            dropoffLocation,
            rideType,
            scheduledTime: scheduledTime ? new Date(scheduledTime) : null
        });

        await newRide.save();
        res.status(201).json({ message: "Ride created successfully!", ride: newRide });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get all rides for a user
exports.getUserRides = async (req, res) => {
    try {
        const { userId } = req.params;
        const rides = await Ride.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rides", error });
    }
};

// Update ride status (Completed, Cancelled, etc.)
exports.updateRideStatus = async (req, res) => {
    try {
        const { rideId } = req.params;
        const { status } = req.body;

        const updatedRide = await Ride.findByIdAndUpdate(rideId, { status }, { new: true });

        if (!updatedRide) {
            return res.status(404).json({ message: "Ride not found" });
        }

        res.status(200).json({ message: "Ride status updated successfully!", ride: updatedRide });
    } catch (error) {
        res.status(500).json({ message: "Error updating ride status", error });
    }
};

