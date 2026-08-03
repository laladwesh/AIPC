const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authController = require('./controllers/authController');
const adminController = require('./controllers/adminController');
const eventCompanyController = require('./controllers/eventCompanyController');
const requireAdmin = require('./middleware/adminAuth');

const app = express();

// The production deployment sits behind the server's system nginx
// (iitg.ac.in/aipc -> 127.0.0.1:6025), so req.ip would otherwise always
// resolve to the proxy's own address (127.0.0.1) for every visitor —
// silently pooling every client into one rate-limit bucket. Trusting one
// proxy hop makes req.ip read the real client IP from X-Forwarded-For.
app.set('trust proxy', 1);

// BASE_PATH lets the whole app (API + built frontend) be served under a
// sub-path, e.g. BASE_PATH=/aipc when reverse-proxied at https://host/aipc
const BASE_PATH = process.env.BASE_PATH || '';
const apiBase = `${BASE_PATH}/api/v1`;

// General ceiling across the whole API — defense in depth against scraping
// and abuse that isn't otherwise covered by a more specific limiter below.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' }
});

// Tighter limit for OTP request/verify endpoints specifically — these are
// the routes an attacker would actually want to hammer (spam OTP emails,
// or brute-force the 6-digit code across many freshly-requested OTPs
// instead of exhausting the 3-attempt-per-OTP cap already enforced in the
// controllers).
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many attempts. Please try again later.' }
});

// Admin login is the highest-value target on this app, so it gets its own
// stricter, separately-tracked limit.
const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many attempts. Please try again later.' }
});

// Whitelist origins for CORS & Credentials. Scoped to the API routes only —
// static asset requests (e.g. Vite's crossorigin script/link tags) send an
// Origin header too, and gating those against this whitelist as well made
// same-origin asset loads fail with a CORS-rejection 500.
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'http://localhost:5000',
  'http://localhost:6025',
  'http://172.17.1.148'
];

app.use(apiBase, cors({
  origin: function (origin, callback) {
    if (!origin || origin === 'null' || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS Policy'));
    }
  },
  credentials: true
}));

app.use(apiBase, apiLimiter);

app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aipc_portal')
  .then(() => console.log('MongoDB Connected: AIPC Multi-Role Backend Ready'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// --- RECRUITER & PUBLIC ROUTES ---
app.post(`${apiBase}/auth/register`, otpLimiter, authController.registerCompany);
app.post(`${apiBase}/auth/login`, otpLimiter, authController.requestLoginOtp);
app.post(`${apiBase}/auth/verify-otp`, otpLimiter, authController.verifyOtp);
app.get(`${apiBase}/auth/me`, authController.getAuthenticatedUser);
app.post(`${apiBase}/auth/logout`, authController.logout);
app.get(`${apiBase}/auth/check-company`, authController.checkCompany);
app.get(`${apiBase}/company/details`, authController.getCompanyDetails);

// --- COMPANY REGISTRATION (brought to the meet by an institute) ---
app.post(`${apiBase}/companies/register`, otpLimiter, eventCompanyController.registerCompany);
app.post(`${apiBase}/companies/verify-otp`, otpLimiter, eventCompanyController.verifyCompanyOtp);
app.post(`${apiBase}/companies/attendees`, eventCompanyController.submitAttendees);

// --- TPO ADMIN ROUTES ---
app.post(`${apiBase}/admin/auth/login`, adminAuthLimiter, adminController.requestAdminOtp);
app.post(`${apiBase}/admin/auth/verify-otp`, adminAuthLimiter, adminController.verifyAdminOtp);
app.get(`${apiBase}/admin/me`, requireAdmin, adminController.getAdminProfile);
app.get(`${apiBase}/admin/pending-companies`, requireAdmin, adminController.getPendingCompanies);
app.get(`${apiBase}/admin/approved-companies`, requireAdmin, adminController.getApprovedCompanies);
app.get(`${apiBase}/admin/rejected-companies`, requireAdmin, adminController.getRejectedCompanies);
app.patch(`${apiBase}/admin/review-company`, requireAdmin, adminController.reviewCompany);
app.post(`${apiBase}/admin/auth/logout`, adminController.adminLogout);

// --- BUILT FRONTEND (served directly, no nginx) ---
// Single-page app now — the registration form IS the home page, so every
// route just gets the same static index.html (its baked-in meta tags
// already describe the registration page).
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