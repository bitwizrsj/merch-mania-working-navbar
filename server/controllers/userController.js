const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
exports.registerUser = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const user = new User({ name, email, password: hashedPassword, isAdmin });
        await user.save();

        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.error('Error during user registration:', error.message); // Log the error for debugging
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token with user name
        const token = jwt.sign(
            { userId: user._id, name: user.name, isAdmin: user.isAdmin }, // Include the user's name
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        // Log success to the console
        console.log(`User ${user.email} logged in successfully`);

        // Send the token back to the client
        return res.status(200).json({ token });

    } catch (error) {
        console.error('Error during user login:', error.message); // Log the error for debugging
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

