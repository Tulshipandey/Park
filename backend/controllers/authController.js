const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 

const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body; 

        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email }); 

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Error registering user", error });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = req.user; // This should be set in the auth middleware
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: "Error fetching user profile" });
    }
};


module.exports = { registerUser, loginUser, getUserProfile };
