const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure the correct path

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) return res.status(401).json({ error: "User not found" });

        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;
