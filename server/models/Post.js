// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model
    required: true,
  },
  platform: {
    type: String,
    required: true,
    enum: ['Twitter', 'LinkedIn'] // Restrict to these platforms
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100 // Example max length for title
  },
  content: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);