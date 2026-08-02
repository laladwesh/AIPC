const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authController = require('./controllers/authController');
const adminController = require('./controllers/adminController');
const requireAdmin = require('./middleware/adminAuth');

const app = express();

// Whitelist origins for CORS & Credentials
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'http://localhost:5000',
  'http://localhost:6025'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin === 'null' || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS Policy'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aipc_portal')
  .then(() => console.log('MongoDB Connected: AIPC Multi-Role Backend Ready'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// --- RECRUITER & PUBLIC ROUTES ---
app.post('/api/v1/auth/register', authController.registerCompany);
app.post('/api/v1/auth/login', authController.requestLoginOtp);
app.post('/api/v1/auth/verify-otp', authController.verifyOtp);
app.get('/api/v1/auth/me', authController.getAuthenticatedUser);
app.post('/api/v1/auth/logout', authController.logout);
app.get('/api/v1/auth/check-company', authController.checkCompany);
app.get('/api/v1/company/details', authController.getCompanyDetails);

// --- TPO ADMIN ROUTES ---
app.post('/api/v1/admin/auth/login', adminController.requestAdminOtp);
app.post('/api/v1/admin/auth/verify-otp', adminController.verifyAdminOtp);
app.get('/api/v1/admin/me', requireAdmin, adminController.getAdminProfile);
app.get('/api/v1/admin/pending-companies', requireAdmin, adminController.getPendingCompanies);
app.get('/api/v1/admin/approved-companies', requireAdmin, adminController.getApprovedCompanies);
app.get('/api/v1/admin/rejected-companies', requireAdmin, adminController.getRejectedCompanies);
app.patch('/api/v1/admin/review-company', requireAdmin, adminController.reviewCompany);
app.post('/api/v1/admin/auth/logout', adminController.adminLogout);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AIPC Full-Stack Server running on port ${PORT}`));