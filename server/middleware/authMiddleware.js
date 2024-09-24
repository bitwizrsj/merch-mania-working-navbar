const jwt = require('jsonwebtoken');

// Middleware to verify the token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied, no token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // decoded token will have userId and isAdmin
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied, admin only.' });
    next();
};
