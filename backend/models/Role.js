// models/Role.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['admin', 'user']
  },
  code: {
    type: String,
    unique: true,
    default: function() {
      // Generates a secure random identifier for the role
      return crypto.randomBytes(16).toString('hex');
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
