// models/Delegate.js
const mongoose = require('mongoose');

// Keep in sync with frontend/src/institutes.ts
const INSTITUTE_CODES = [
  'kharagpur', 'bombay', 'madras', 'kanpur', 'delhi', 'guwahati', 'roorkee', 'ropar',
  'bhubaneswar', 'gandhinagar', 'hyderabad', 'jodhpur', 'patna', 'indore', 'mandi',
  'varanasi', 'palakkad', 'tirupati', 'dhanbad', 'bhilai', 'dharwad', 'jammu', 'goa'
];

const delegateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, trim: true, default: 'Professor-in-charge, Placement' },
  institute: { type: String, required: true, enum: INSTITUTE_CODES, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  contactNumber: { type: String, required: true, trim: true }
}, { timestamps: true });

delegateSchema.statics.INSTITUTE_CODES = INSTITUTE_CODES;

module.exports = mongoose.model('Delegate', delegateSchema);
