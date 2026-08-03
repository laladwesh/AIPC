// models/EventCompany.js
const mongoose = require('mongoose');

// Keep in sync with frontend/src/institutes.ts
const INSTITUTE_CODES = [
  'kharagpur', 'bombay', 'madras', 'kanpur', 'delhi', 'guwahati', 'roorkee', 'ropar',
  'bhubaneswar', 'gandhinagar', 'hyderabad', 'jodhpur', 'patna', 'indore', 'mandi',
  'varanasi', 'palakkad', 'tirupati', 'dhanbad', 'bhilai', 'dharwad', 'jammu', 'goa'
];

// A company brought to the meet by an institute — multiple companies per
// institute are fine, unlike the one-delegate-per-institute rule.
const eventCompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },
  institute: { type: String, required: true, enum: INSTITUTE_CODES },
  status: { type: String, enum: ['PENDING_OTP', 'CONFIRMED'], default: 'PENDING_OTP' }
}, { timestamps: true });

// Guards against accidental duplicate submits, not a "one company total" rule
eventCompanySchema.index({ email: 1, institute: 1 }, { unique: true });

eventCompanySchema.statics.INSTITUTE_CODES = INSTITUTE_CODES;

module.exports = mongoose.model('EventCompany', eventCompanySchema);
