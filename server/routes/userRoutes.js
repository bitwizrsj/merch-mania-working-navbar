const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { getAllUsers } = require('../controllers/adminController');
const router = express.Router();

// Public routes
// Route for user registration
router.post('/register', registerUser); // Response handled in registerUser

// Route for user login
router.post('/login', loginUser); // Response handled in loginUser

// Admin route to get all users (protected)
router.get('/admin', verifyToken, isAdmin, getAllUsers); // Response handled in getAllUsers

module.exports = router;
