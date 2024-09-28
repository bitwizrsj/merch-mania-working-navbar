const express = require('express');
const multer = require('multer');
const Image = require('../models/Image'); // Import Image model to interact with DB
const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Unique file names
  }
});

const upload = multer({ storage: storage });

// Upload carousel image route
router.post('/carousel', upload.single('carouselImage'), async (req, res) => { // Changed path to /carousel
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const newImage = new Image({ url: imageUrl });
    await newImage.save(); // Save image URL to MongoDB
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).send('Error saving image');
  }
});

// API to retrieve carousel images
router.get('/carousel-images', async (req, res) => {
  try {
    const images = await Image.find(); // Fetch all images from the database
    res.json(images); // Send the image list as JSON response
  } catch (error) {
    res.status(500).send('Error fetching images');
  }
});

module.exports = router;
