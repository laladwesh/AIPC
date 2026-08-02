// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  contactNumber: { type: String, required: true },
  
  // Registration Lifecycle Management
  status: { 
    type: String, 
    enum: ['PENDING_OTP', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'], 
    default: 'PENDING_OTP' 
  },
  
  rejectionReason: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);