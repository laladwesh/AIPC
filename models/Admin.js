const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  name: { 
    type: String, 
    default: 'TPO Admin' 
  },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'PLACEMENT_OFFICER'], 
    default: 'PLACEMENT_OFFICER' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);