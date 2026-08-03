const crypto = require('crypto');
const EventCompany = require('../models/EventCompany');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/mailer');

const hashData = (data) => crypto.createHash('sha256').update(data).digest('hex');

// --- STEP 1: SUBMIT DETAILS, SEND OTP ---
exports.registerCompany = async (req, res) => {
  try {
    const { companyName, email, phoneNumber, institute } = req.body;

    if (!companyName || !email || !phoneNumber || !institute) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    if (!EventCompany.INSTITUTE_CODES.includes(institute)) {
      return res.status(400).json({ success: false, error: 'Invalid institute selection.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid email address.' });
    }

    let company = await EventCompany.findOne({ email: cleanEmail, institute });
    if (company && company.status === 'CONFIRMED') {
      return res.status(400).json({ success: false, error: 'This company is already registered for this institute.' });
    }

    if (company) {
      company.companyName = companyName.trim();
      company.phoneNumber = phoneNumber.trim();
      await company.save();
    } else {
      company = await EventCompany.create({
        companyName: companyName.trim(),
        email: cleanEmail,
        phoneNumber: phoneNumber.trim(),
        institute,
        status: 'PENDING_OTP'
      });
    }

    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashData(rawOtp);

    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({ email: cleanEmail, otpHash });

    await sendEmail(
      cleanEmail,
      'AIPC Portal - Verification Code',
      `Your verification code is ${rawOtp}. It will expire in 10 minutes.`
    );

    return res.status(200).json({
      success: true,
      message: 'OTP dispatched successfully to your email.'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'This company is already registered for this institute.' });
    }
    console.error('Company Registration Error:', error);
    return res.status(500).json({ success: false, error: 'Server error during registration.' });
  }
};

// --- STEP 2: VERIFY OTP, CONFIRM REGISTRATION ---
exports.verifyCompanyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({ email: cleanEmail });

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'OTP has expired or was not requested.' });
    }

    if (otpRecord.attempts >= 3) {
      await Otp.deleteOne({ email: cleanEmail });
      return res.status(429).json({ success: false, error: 'Too many failed attempts. Request a new code.' });
    }

    if (hashData(otp) !== otpRecord.otpHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ success: false, error: 'Invalid verification code.' });
    }

    const company = await EventCompany.findOne({ email: cleanEmail, status: 'PENDING_OTP' }).sort({ createdAt: -1 });
    if (!company) {
      await Otp.deleteOne({ email: cleanEmail });
      return res.status(404).json({ success: false, error: 'Registration not found. Please start again.' });
    }

    company.status = 'CONFIRMED';
    await company.save();
    await Otp.deleteOne({ email: cleanEmail });

    await sendEmail(
      cleanEmail,
      'AIPC 2026 - Registration Request Received',
      `Dear ${company.companyName} team,\n\nYour company's registration request for the 49th AIPC Meet (4th September 2026, IIT Guwahati) has been received. Further updates will be communicated to you by email closer to the date.`
    );

    return res.status(200).json({
      success: true,
      message: 'Registration request received.',
      company: {
        companyName: company.companyName,
        email: company.email,
        institute: company.institute
      }
    });
  } catch (error) {
    console.error('Company OTP Verification Error:', error);
    return res.status(500).json({ success: false, error: 'Server error during verification.' });
  }
};

// --- STEP 3: SUBMIT ATTENDEE DETAILS (up to 2), AFTER OTP VERIFICATION ---
exports.submitAttendees = async (req, res) => {
  try {
    const { email, institute, attendees } = req.body;

    if (!email || !institute) {
      return res.status(400).json({ success: false, error: 'Email and institute are required.' });
    }

    if (!Array.isArray(attendees) || attendees.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one attendee is required.' });
    }

    if (attendees.length > 2) {
      return res.status(400).json({ success: false, error: 'A company can register at most 2 attendees.' });
    }

    const cleanAttendees = attendees
      .map(a => ({ name: (a.name || '').trim(), designation: (a.designation || '').trim() }))
      .filter(a => a.name);

    if (cleanAttendees.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one attendee name is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const company = await EventCompany.findOne({ email: cleanEmail, institute, status: 'CONFIRMED' });
    if (!company) {
      return res.status(404).json({ success: false, error: 'Confirmed registration not found.' });
    }

    company.attendees = cleanAttendees;
    await company.save();

    return res.status(200).json({ success: true, message: 'Attendee details saved.' });
  } catch (error) {
    console.error('Submit Attendees Error:', error);
    return res.status(500).json({ success: false, error: 'Server error saving attendee details.' });
  }
};
