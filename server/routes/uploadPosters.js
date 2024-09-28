const express = require('express');
const multer = require('multer');
const Poster = require('../models/Posters');
const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'posters/'); // save files to this folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // unique file names
    }
});

const upload = multer({ storage: storage });

// Upload posters image route
router.post('/poster', upload.single('posterImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imageUrl = `/posters/${req.file.filename}`;

    try {
        const newPoster = new Poster({ url: imageUrl });
        await newPoster.save(); 
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).send('Error saving poster');
    }
});

// API to retrieve poster images
router.get('/poster-images', async (req, res) => {
    try {
        const posters = await Poster.find();
        res.json(posters);
    } catch (error) {
        res.status(500).send('Error fetching posters');
    }
});

module.exports = router;
