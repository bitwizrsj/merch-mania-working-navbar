const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema({
    url: {
        type: String, 
        required: true 
    },
    title: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Poster = mongoose.model('Poster', posterSchema);

module.exports = Poster;
