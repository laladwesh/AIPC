const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const Otp = require('../models/Otp');
const Admin = require('../models/Admin');
const sendEmail = require('../utils/mailer');

// Helper: SHA-256 Hash Function
const hashData = (data) => crypto.createHash('sha256').update(data).digest('hex');

/**
 * Request OTP for TPO Admin Login
 */
exports.requestAdminOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Admin email is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify if the email belongs to an authorized TPO Admin in DB
    let admin = await Admin.findOne({ email: cleanEmail });
    
    // Auto-seed initial admin ONLY if database has 0 admin records total
    const adminCount = await Admin.countDocuments();
    if (!admin && adminCount === 0) {
      admin = await Admin.create({
        email: cleanEmail,
        name: 'Primary Placement Officer',
        role: 'SUPER_ADMIN'
      });
    }

    // Strictly deny login if email is not explicitly registered in Admin collection
    if (!admin) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. Your email is not registered as an authorized TPO Administrator.' 
      });
    }

    // Generate Cryptographically Secure 6-Digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashData(rawOtp);

    // Save OTP Record
    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({ email: cleanEmail, otpHash });

    // Send Email
    await sendEmail(
      cleanEmail,
      'AIPC Admin Portal - Security Verification Code',
      `Your TPO Admin login access code is ${rawOtp}. Valid for 10 minutes. Do not share this code.`
    );

    return res.status(200).json({
      success: true,
      message: 'Admin verification code dispatched to email.'
    });

  } catch (error) {
    console.error('Request Admin OTP Error:', error);
    return res.status(500).json({ success: false, error: 'Server error requesting admin code.' });
  }
};

/**
 * Verify Admin OTP & Issue Secure HTTP-Only Cookie
 */
exports.verifyAdminOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({ email: cleanEmail });

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'Admin code expired or not requested.' });
    }

    // Brute-force protection
    if (otpRecord.attempts >= 3) {
      await Otp.deleteOne({ email: cleanEmail });
      return res.status(429).json({ success: false, error: 'Too many invalid attempts. Request a new code.' });
    }

    if (hashData(otp) !== otpRecord.otpHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ success: false, error: 'Invalid admin verification code.' });
    }

    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) {
      await Otp.deleteOne({ email: cleanEmail });
      return res.status(404).json({ success: false, error: 'Admin account not found.' });
    }

    await Otp.deleteOne({ email: cleanEmail });

    // Generate Admin JWT Token
    const adminToken = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: 'ADMIN'
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '12h' } // Shorter session duration for security
    );

    // Set Admin Cookie
    res.cookie('aipc_admin_session', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000 // 12 Hours
    });

    return res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully.',
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Verify Admin OTP Error:', error);
    return res.status(500).json({ success: false, error: 'Server error during admin verification.' });
  }
};

/**
 * Fetch Queue of Companies Awaiting TPO Approval
 */
exports.getPendingCompanies = async (req, res) => {
  try {
    const pendingCompanies = await Company.find({ status: 'PENDING_APPROVAL' })
      .select('companyName email contactNumber createdAt status')
      .sort({ createdAt: -1 });

    const formattedList = pendingCompanies.map(c => ({
      id: c._id,
      name: c.companyName,
      email: c.email,
      phone: c.contactNumber,
      date: c.createdAt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));

    return res.status(200).json({
      success: true,
      count: formattedList.length,
      companies: formattedList
    });

  } catch (error) {
    console.error('Get Pending Companies Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch pending applications queue.' });
  }
};

/**
 * Fetch List of Approved Corporate Partners
 */
exports.getApprovedCompanies = async (req, res) => {
  try {
    const approvedCompanies = await Company.find({ status: 'APPROVED' })
      .select('companyName email contactNumber updatedAt status')
      .sort({ updatedAt: -1 });

    const formattedList = approvedCompanies.map(c => ({
      id: c._id,
      name: c.companyName,
      email: c.email,
      phone: c.contactNumber,
      date: c.updatedAt ? c.updatedAt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
    }));

    return res.status(200).json({
      success: true,
      count: formattedList.length,
      companies: formattedList
    });

  } catch (error) {
    console.error('Get Approved Companies Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch approved partners.' });
  }
};

/**
 * Fetch List of Rejected Company Applications
 */
exports.getRejectedCompanies = async (req, res) => {
  try {
    const rejectedCompanies = await Company.find({ status: 'REJECTED' })
      .select('companyName email contactNumber updatedAt rejectionReason status')
      .sort({ updatedAt: -1 });

    const formattedList = rejectedCompanies.map(c => ({
      id: c._id,
      name: c.companyName,
      email: c.email,
      phone: c.contactNumber,
      date: c.updatedAt ? c.updatedAt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      rejectionReason: c.rejectionReason || 'No specific reason recorded.'
    }));

    return res.status(200).json({
      success: true,
      count: formattedList.length,
      companies: formattedList
    });

  } catch (error) {
    console.error('Get Rejected Companies Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch rejected companies.' });
  }
};

/**
 * Approve or Reject a Company Registration
 */
exports.reviewCompany = async (req, res) => {
  try {
    const { email, status, rejectionReason } = req.body;

    if (!email || !status) {
      return res.status(400).json({ success: false, error: 'Company email and target status are required.' });
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid review status. Must be APPROVED or REJECTED.' });
    }

    if (status === 'REJECTED' && !rejectionReason) {
      return res.status(400).json({ success: false, error: 'A rejection reason must be provided.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const company = await Company.findOneAndUpdate(
      { email: cleanEmail },
      { 
        status, 
        rejectionReason: status === 'REJECTED' ? rejectionReason : null 
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company record not found.' });
    }

    // Dispatch Decision Email
    const subject = status === 'APPROVED' 
      ? 'AIPC Placement Portal - Company Registration Approved' 
      : 'AIPC Placement Portal - Registration Status Update';
      
    const textBody = status === 'APPROVED'
      ? `Dear ${company.companyName} Recruiting Team,\n\nYour profile has been verified and approved by the Training & Placement Office. You can now log into the portal to publish Job Announcement Forms (JAFs).\n\nBest regards,\nAIPC Team`
      : `Dear ${company.companyName} Recruiting Team,\n\nThank you for your registration request. Upon administrative review, your profile application was not approved for the following reason:\n\n"${rejectionReason}"\n\nIf you believe this was an error, please contact the placement office.\n\nBest regards,\nAIPC Team`;

    await sendEmail(cleanEmail, subject, textBody);

    return res.status(200).json({
      success: true,
      message: `Company ${status.toLowerCase()} successfully.`,
      company: {
        name: company.companyName,
        email: company.email,
        status: company.status
      }
    });

  } catch (error) {
    console.error('Review Company Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update company registration status.' });
  }
};

/**
 * Check Active Admin Session
 */
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('name email role');
    if (!admin) {
      res.clearCookie('aipc_admin_session');
      return res.status(401).json({ success: false, isLoggedOut: true });
    }

    return res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error checking admin session.' });
  }
};

/**
 * Admin Logout
 */
exports.adminLogout = (req, res) => {
  res.clearCookie('aipc_admin_session');
  return res.status(200).json({ success: true, message: 'Admin logged out successfully.' });
};