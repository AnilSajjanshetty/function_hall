const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: String, // You can change to Date if needed
    required: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  videos: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Event', EventSchema);