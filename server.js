const path = require('path');
const fs = require('fs');
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

// BASE_PATH lets the whole app (API + built frontend) be served under a
// sub-path, e.g. BASE_PATH=/aipc when reverse-proxied at https://host/aipc
const BASE_PATH = process.env.BASE_PATH || '';
const apiBase = `${BASE_PATH}/api/v1`;

// --- RECRUITER & PUBLIC ROUTES ---
app.post(`${apiBase}/auth/register`, authController.registerCompany);
app.post(`${apiBase}/auth/login`, authController.requestLoginOtp);
app.post(`${apiBase}/auth/verify-otp`, authController.verifyOtp);
app.get(`${apiBase}/auth/me`, authController.getAuthenticatedUser);
app.post(`${apiBase}/auth/logout`, authController.logout);
app.get(`${apiBase}/auth/check-company`, authController.checkCompany);
app.get(`${apiBase}/company/details`, authController.getCompanyDetails);

// --- TPO ADMIN ROUTES ---
app.post(`${apiBase}/admin/auth/login`, adminController.requestAdminOtp);
app.post(`${apiBase}/admin/auth/verify-otp`, adminController.verifyAdminOtp);
app.get(`${apiBase}/admin/me`, requireAdmin, adminController.getAdminProfile);
app.get(`${apiBase}/admin/pending-companies`, requireAdmin, adminController.getPendingCompanies);
app.get(`${apiBase}/admin/approved-companies`, requireAdmin, adminController.getApprovedCompanies);
app.get(`${apiBase}/admin/rejected-companies`, requireAdmin, adminController.getRejectedCompanies);
app.patch(`${apiBase}/admin/review-company`, requireAdmin, adminController.reviewCompany);
app.post(`${apiBase}/admin/auth/logout`, adminController.adminLogout);

// --- BUILT FRONTEND (served directly, no nginx) ---
const FRONTEND_DIST = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(BASE_PATH || '/', express.static(FRONTEND_DIST));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || (BASE_PATH && !req.path.startsWith(BASE_PATH))) {
      return next();
    }
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AIPC Full-Stack Server running on port ${PORT}`));