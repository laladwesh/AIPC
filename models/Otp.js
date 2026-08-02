// models/Otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  otpHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  
  // MongoDB TTL Index: Auto-deletes document after 10 minutes (600 seconds)
  createdAt: { type: Date, default: Date.now, expires: 600 } 
});

module.exports = mongoose.model('Otp', otpSchema);