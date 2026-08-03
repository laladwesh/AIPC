const Delegate = require('../models/Delegate');

// Dummy Nodemailer Transporter (same pattern as authController)
const sendEmail = async (to, subject, text) => {
  console.log(`\n========================================`);
  console.log(`[DUMMY EMAIL SENT]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${text}`);
  console.log(`========================================\n`);
  return true;
};

// --- REGISTER INSTITUTE DELEGATE ---
exports.registerDelegate = async (req, res) => {
  try {
    const { name, designation, institute, email, contactNumber } = req.body;

    if (!name || !institute || !email || !contactNumber) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    if (!Delegate.INSTITUTE_CODES.includes(institute)) {
      return res.status(400).json({ success: false, error: 'Invalid institute selection.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid email address.' });
    }

    const existingInstitute = await Delegate.findOne({ institute });
    if (existingInstitute) {
      return res.status(400).json({
        success: false,
        error: `A delegate for this institute is already registered (${existingInstitute.name}).`
      });
    }

    const delegate = await Delegate.create({
      name: name.trim(),
      designation: designation ? designation.trim() : undefined,
      institute,
      email: cleanEmail,
      contactNumber: contactNumber.trim()
    });

    await sendEmail(
      cleanEmail,
      'AIPC 2026 - Registration Confirmed',
      `Dear ${delegate.name},\n\nYour registration as the delegate for your institute at the 49th AIPC Meet (4th September 2026, IIT Guwahati) is confirmed. We'll email your joining instructions closer to the date.`
    );

    return res.status(201).json({
      success: true,
      message: 'Registration confirmed. A confirmation email has been sent.',
      delegate: {
        name: delegate.name,
        designation: delegate.designation,
        institute: delegate.institute,
        email: delegate.email
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'This email or institute is already registered.' });
    }
    console.error('Delegate Registration Error:', error);
    return res.status(500).json({ success: false, error: 'Server error during registration.' });
  }
};

// --- LIST INSTITUTES ALREADY REGISTERED (so the frontend can disable them) ---
exports.getRegisteredInstitutes = async (req, res) => {
  try {
    const institutes = await Delegate.distinct('institute');
    return res.status(200).json({ success: true, institutes });
  } catch (error) {
    console.error('Fetch Registered Institutes Error:', error);
    return res.status(500).json({ success: false, error: 'Server error fetching registered institutes.' });
  }
};
