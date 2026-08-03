// models/EventCompany.js
const mongoose = require('mongoose');

// Keep in sync with frontend/src/institutes.ts
const INSTITUTE_CODES = [
  'kharagpur', 'bombay', 'madras', 'kanpur', 'delhi', 'guwahati', 'roorkee', 'ropar',
  'bhubaneswar', 'gandhinagar', 'hyderabad', 'jodhpur', 'patna', 'indore', 'mandi',
  'varanasi', 'palakkad', 'tirupati', 'dhanbad', 'bhilai', 'dharwad', 'jammu', 'goa'
];

// One individual registers on behalf of their company. companyName + email
// are collected upfront (before OTP); designation, institute and phone are
// only asked once the email is verified, so status tracks that in-between
// state rather than requiring everything at creation time.
const eventCompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, trim: true },
  designation: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  institute: { type: String, enum: INSTITUTE_CODES },
  // PENDING_OTP: email not yet verified
  // PENDING_DETAILS: OTP verified, designation/institute/phone still needed
  // CONFIRMED: registration complete
  status: { type: String, enum: ['PENDING_OTP', 'PENDING_DETAILS', 'CONFIRMED'], default: 'PENDING_OTP' }
}, { timestamps: true });

eventCompanySchema.statics.INSTITUTE_CODES = INSTITUTE_CODES;

module.exports = mongoose.model('EventCompany', eventCompanySchema);
