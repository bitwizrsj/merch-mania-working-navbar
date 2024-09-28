const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const uploadPoster = require('./routes/uploadPosters')


require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());



// Database connection
const dbURI = process.env.MONGO_URI;
if (!dbURI) {
    console.error('MONGO_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(dbURI)
    .then(() => console.log("MongoDB is connected"))
    .catch(err => console.error("DB connection error:", err));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/posters', express.static(path.join(__dirname, 'posters')));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to MerchMania');
  });
app.use('/api/users', userRoutes);
app.use('/api', uploadRoutes);
app.use('/api', uploadPoster);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5004;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}. Click to check http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log("Shutting down gracefully...");
    server.close(() => {
        mongoose.connection.close();
        console.log("Closed all connections. Exiting...");
        process.exit(0);
    });
});
