const Booking = require("../models/Booking");
const Ride = require("../models/Ride");
const mongoose = require("mongoose");

// ✅ Create a new ride booking
const createBooking = async (req, res) => {
    try {
        const { rideType, pickupLocation, dropLocation, distance } = req.body;
        const userId = req.user.id; // Extracted from JWT

        // Calculate total fare
        const baseFare = 50; // Default base fare
        const surgeMultiplier = 1; // Default surge multiplier
        const totalFare = baseFare + distance * 10 * surgeMultiplier;

        // Create a new ride booking
        const newBooking = new Booking({
            user: userId,
            rideType,
            pickupLocation,
            dropLocation,
            distance,
            fare: totalFare,
        });

        await newBooking.save();
        res.status(201).json({ message: "Ride booked successfully!", booking: newBooking });
    } catch (error) {
        res.status(500).json({ error: "Error booking ride", details: error.message });
    }
};

// ✅ Get all user bookings
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Error fetching bookings", details: error.message });
    }
};

// ✅ Cancel a booking
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ error: "Booking not found" });
        if (booking.user.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({ message: "Booking cancelled successfully!", booking });
    } catch (error) {
        res.status(500).json({ error: "Error cancelling booking", details: error.message });
    }
};

// ✅ Get upcoming rides for a user
const getUpcomingRides = async (req, res) => {
    const { userId } = req.params;

    try {
        const upcomingRides = await Booking.find({
            userId: mongoose.Types.ObjectId(userId),
            scheduledTime: { $gte: new Date() },
            status: "pending",
        });

        res.status(200).json(upcomingRides);
    } catch (error) {
        res.status(500).json({ message: "Error fetching scheduled rides", details: error.message });
    }
};

// ✅ Request a shared ride
const requestSharedRide = async (req, res) => {
    const { userId, pickupLocation, dropoffLocation, distance } = req.body;

    // Validate inputs
    if (!userId || !pickupLocation || !dropoffLocation || isNaN(distance) || distance <= 0) {
        return res.status(400).json({
            message: "Invalid input data",
            details: "Ensure all fields ('userId', 'pickupLocation', 'dropoffLocation', 'distance') are provided, and 'distance' is a positive number.",
        });
    }

    try {
        console.log("User ID:", userId);
        console.log("Pickup Location:", pickupLocation);
        console.log("Dropoff Location:", dropoffLocation);
        console.log("Request payload:", { userId, pickupLocation, dropoffLocation, distance });

        // Check for an existing ride that matches the criteria
        const existingRide = await Ride.findOne({
            dropoffLocation,
            status: "pending",
            "pooling.users": { $size: { $lt: 4 } }, // Max 4 passengers
        });

        if (existingRide) {
            // Add user to the existing ride
            existingRide.pooling.users.push(userId);
            await existingRide.save();
            return res.status(200).json({ message: "Joined existing shared ride", ride: existingRide });
        }

        // Calculate total fare
        const baseFare = 50; // Base fare per km
        const surgeMultiplier = 1; // Surge multiplier (if needed)
        const totalFare = distance * baseFare * surgeMultiplier;

        console.log("Calculated totalFare:", totalFare);

        if (isNaN(totalFare) || totalFare <= 0) {
            return res.status(500).json({
                message: "Invalid totalFare calculation",
                details: `Calculated fare is ${totalFare}`,
            });
        }

        // Create a new ride if no existing ride matches
        const newRide = new Ride({
            userId,
            pickupLocation,
            dropoffLocation,
            distance,
            baseFare,
            surgeMultiplier,
            totalFare,
            pooling: { enabled: true, users: [userId] },
        });

        await newRide.save();
        res.status(201).json({ message: "Shared ride created successfully", ride: newRide });
    } catch (error) {
        console.error("Error in requestSharedRide:", error.message);
        res.status(500).json({
            message: "Error requesting shared ride",
            details: error.message,
        });
    }
};




// ✅ Export all functions
module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking,
    getUpcomingRides,
    requestSharedRide,
};
