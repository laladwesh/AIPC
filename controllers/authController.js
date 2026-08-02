const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Added missing dependency
const Company = require('../models/Company');
const Otp = require('../models/Otp');

// Helper: Hash OTP using SHA-256 before database storage
const hashData = (data) => crypto.createHash('sha256').update(data).digest('hex');

// Helper: Dummy Nodemailer Transporter
const sendEmail = async (to, subject, text) => {
  // In production, configure your SMTP settings (e.g., SendGrid, AWS SES)
  console.log(`\n========================================`);
  console.log(`[DUMMY EMAIL SENT]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${text}`);
  console.log(`========================================\n`);
  return true;
};

// --- 1. REGISTER / INITIATE OTP ---
exports.registerCompany = async (req, res) => {
  try {
    const { companyName, email, contactNumber } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!companyName || !contactNumber) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
          success: false,
          error: 'Invalid email address.'
      });
    }

    // Upsert company details (set to PENDING_OTP)
    let company = await Company.findOne({ email: cleanEmail });
    if (company) {
        if (company.status === 'APPROVED') {
            return res.status(400).json({
                success: false,
                error: 'Company already registered.'
            });
        }

        if (company.status === 'PENDING_APPROVAL') {
            return res.status(400).json({
                success: false,
                error: 'Registration is awaiting approval.'
            });
        }
        // Allow REJECTED or PENDING_OTP to update registration
    } else {
      company = new Company({ companyName, email: cleanEmail, contactNumber });
      await company.save();
    }

    // Generate Cryptographically Secure 6-Digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashData(rawOtp);

    // FIX: Use { email: cleanEmail } instead of { cleanEmail }
    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({ email: cleanEmail, otpHash });

    // Dispatch Dummy Email
    await sendEmail(
      cleanEmail, 
      'AIPC Portal - Verification Code', 
      `Your verification code is ${rawOtp}. It will expire in 10 minutes.`
    );

    return res.status(200).json({ 
      success: true, 
      message: 'OTP dispatched successfully to your corporate email.' 
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, error: 'Server error during registration.' });
  }
};

// --- 2. REQUEST LOGIN OTP (For Existing Companies) ---
exports.requestLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });

    const company = await Company.findOne({ email: email.toLowerCase().trim() });
    if (!company) {
      return res.status(404).json({ success: false, error: 'No account found with this email. Please register.' });
    }

    // Generate 6-Digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashData(rawOtp);

    await Otp.deleteMany({ email: company.email });
    await Otp.create({ email: company.email, otpHash });

    await sendEmail(
        company.email,
        'AIPC Login Verification Code',
        `Your login verification code is ${rawOtp}. It expires in 10 minutes.`
    );

    return res.status(200).json({ 
      success: true, 
      message: 'Login verification code sent to your email.' 
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error requesting login OTP.' });
  }
};

// --- 3. VERIFY OTP & SET COOKIE ---
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, error: 'Email and OTP required.' });

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

    // OTP Verified -> Advance state if registering or maintain if logging in
    const company = await Company.findOne({ email: cleanEmail });

    if (!company) {
        await Otp.deleteOne({ email: cleanEmail });
        return res.status(404).json({
            success: false,
            error: 'Company not found.'
        });
    }

    if (company.status === 'PENDING_OTP') {
      company.status = 'PENDING_APPROVAL';
      await company.save();
    }

    await Otp.deleteOne({ email: cleanEmail });
    
    // Create JWT Token
    const token = jwt.sign(
        {
            id: company._id,
            email: company.email
        },
        process.env.JWT_SECRET || 'fallback_secret', // Always ensure a secret exists
        {
            expiresIn: '7d'
        }
    );

    res.cookie('aipc_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Authenticated successfully.',
      company: {
        name: company.companyName,
        email: company.email,
        phone: company.contactNumber,
        status: company.status
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ success: false, error: 'Server error during verification.' });
  }
};

// --- 4. FETCH AUTHENTICATED USER FROM COOKIE ---
exports.getAuthenticatedUser = async (req, res) => {
  try {
    const sessionCookie = req.cookies.aipc_session;
    if (!sessionCookie) {
      return res.status(401).json({ success: false, isLoggedOut: true });
    }

    let decoded;

    // FIX: Use jwt.verify instead of JSON.parse
    try {
        decoded = jwt.verify(sessionCookie, process.env.JWT_SECRET || 'fallback_secret');
    } catch (err) {
        res.clearCookie('aipc_session');
        return res.status(401).json({
            success: false,
            isLoggedOut: true
        });
    }

    const { email } = decoded;

    const company = await Company.findOne({ email });

    if (!company) {
      res.clearCookie('aipc_session');
      return res.status(401).json({ success: false, isLoggedOut: true });
    }

    // switch (company.status) {
    //     case 'PENDING_APPROVAL':
    //         return res.status(403).json({
    //             success: false,
    //             error: 'Your registration is awaiting approval.'
    //         });

    //     case 'REJECTED':
    //         return res.status(403).json({
    //             success: false,
    //             error: company.rejectionReason || 'Registration rejected.'
    //         });
    // }

    return res.status(200).json({
      success: true,
      company: {
        name: company.companyName,
        email: company.email,
        phone: company.contactNumber,
        status: company.status,
        joinedDate: company.createdAt ? company.createdAt.toLocaleString('en-US', { month: 'short', year: 'numeric' }) : '',
        rejectionReason: company.rejectionReason
      }
    });
  } catch (error) {
    console.error('Auth User Check Error:', error);
    return res.status(401).json({ success: false, isLoggedOut: true });
  }
};

// --- 5. LOGOUT ---
exports.logout = (req, res) => {
  res.clearCookie('aipc_session');
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// --- 6. FETCH DETAILS IF REGISTERED ---
exports.getCompanyDetails = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email parameter is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const company = await Company.findOne({ email: cleanEmail });

    if (!company) {
      return res.status(200).json({ 
        success: true, 
        isRegistered: false, 
        message: 'No registration found for this email.' 
      });
    }

    return res.status(200).json({
      success: true,
      isRegistered: true,
      company: {
        id: company._id,
        name: company.companyName,
        email: company.email,
        phone: company.contactNumber,
        status: company.status,
        joinedDate: company.createdAt ? company.createdAt.toLocaleString('en-US', { month: 'short', year: 'numeric' }) : '',
        rejectionReason: company.rejectionReason
      }
    });

  } catch (error) {
    console.error('Fetch Registration Details Error:', error);
    return res.status(500).json({ success: false, error: 'Server error fetching company details.' });
  }
};

// --- 7. TPO ADMIN ACTION (Approve/Reject) ---
exports.updateCompanyStatus = async (req, res) => {
  try {
    const { email, status, rejectionReason } = req.body;

    if (!email || !status) {
        return res.status(400).json({ success: false, error: 'Email and status are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status update.' });
    }

    // FIX: Use { email: cleanEmail } instead of { cleanEmail }
    const company = await Company.findOneAndUpdate(
      { email: cleanEmail },
      { status, rejectionReason: status === 'REJECTED' ? rejectionReason : null },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found.' });
    }

    // Send decision email
    const subject = status === 'APPROVED' ? 'AIPC Portal - Registration Approved' : 'AIPC Portal - Registration Status Update';
    const body = status === 'APPROVED' 
      ? 'Your company profile has been verified. You can now log in and publish JAFs.'
      : `Your registration was not approved. Reason: ${rejectionReason}`;

    await sendEmail(cleanEmail, subject, body);

    return res.status(200).json({ success: true, company });

  } catch (error) {
    console.error('Status Update Error:', error);
    return res.status(500).json({ success: false, error: 'Server error updating status.' });
  }
};

exports.checkCompany = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required."
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const company = await Company.findOne({ email: cleanEmail });

    if (!company) {
      return res.status(200).json({
        success: true,
        exists: false
      });
    }

    return res.status(200).json({
      success: true,
      exists: true,
      company: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        contactNumber: company.contactNumber,
        status: company.status,
        rejectionReason: company.rejectionReason || null,
        createdAt: company.createdAt
      }
    });

  } catch (err) {
    console.error("Check Company Error:", err);

    return res.status(500).json({
      success: false,
      error: "Internal server error."
    });
  }
};