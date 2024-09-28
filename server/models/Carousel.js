const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: String,
});

module.exports = mongoose.model('Image', ImageSchema);
