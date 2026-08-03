const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authController = require('./controllers/authController');
const adminController = require('./controllers/adminController');
const eventCompanyController = require('./controllers/eventCompanyController');
const requireAdmin = require('./middleware/adminAuth');

const app = express();

// BASE_PATH lets the whole app (API + built frontend) be served under a
// sub-path, e.g. BASE_PATH=/aipc when reverse-proxied at https://host/aipc
const BASE_PATH = process.env.BASE_PATH || '';
const apiBase = `${BASE_PATH}/api/v1`;

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

app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aipc_portal')
  .then(() => console.log('MongoDB Connected: AIPC Multi-Role Backend Ready'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// --- RECRUITER & PUBLIC ROUTES ---
app.post(`${apiBase}/auth/register`, authController.registerCompany);
app.post(`${apiBase}/auth/login`, authController.requestLoginOtp);
app.post(`${apiBase}/auth/verify-otp`, authController.verifyOtp);
app.get(`${apiBase}/auth/me`, authController.getAuthenticatedUser);
app.post(`${apiBase}/auth/logout`, authController.logout);
app.get(`${apiBase}/auth/check-company`, authController.checkCompany);
app.get(`${apiBase}/company/details`, authController.getCompanyDetails);

// --- COMPANY REGISTRATION (brought to the meet by an institute) ---
app.post(`${apiBase}/companies/register`, eventCompanyController.registerCompany);
app.post(`${apiBase}/companies/verify-otp`, eventCompanyController.verifyCompanyOtp);

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
  const SITE_URL = 'https://iitg.ac.in/aipc';
  const indexHtml = fs.readFileSync(path.join(FRONTEND_DIST, 'index.html'), 'utf-8');

  // Per-route <title>/meta overrides so crawlers and social-preview bots that
  // don't execute JS (Googlebot does; most link-unfurl bots don't) still see
  // route-correct tags on first response, not just the Home defaults already
  // baked into index.html. Client-side nav updates the same tags via
  // useDocumentMeta for consistency after SPA route changes.
  const ROUTE_META = {
    '/register': {
      title: 'Register Your Company | 49th AIPC Meet 2026',
      description: "Register your company for the 49th AIPC Meet, 4th September 2026 at IIT Guwahati. Enter your company details and the IIT bringing you, verify by email, and you're done."
    }
  };

  const escapeHtml = (str) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const renderIndexHtml = (routePath) => {
    const meta = ROUTE_META[routePath];
    if (!meta) return indexHtml;

    const title = escapeHtml(meta.title);
    const description = escapeHtml(meta.description);
    const canonicalUrl = `${SITE_URL}${routePath}`;

    return indexHtml
      .replace(/<title id="meta-title">[^<]*<\/title>/, `<title id="meta-title">${title}</title>`)
      .replace(/(id="meta-description"[^>]*content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(id="meta-og-title"[^>]*content=")[^"]*(")/, `$1${title}$2`)
      .replace(/(id="meta-og-description"[^>]*content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(id="meta-og-url"[^>]*content=")[^"]*(")/, `$1${canonicalUrl}$2`)
      .replace(/(id="meta-twitter-title"[^>]*content=")[^"]*(")/, `$1${title}$2`)
      .replace(/(id="meta-twitter-description"[^>]*content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(id="meta-canonical"[^>]*href=")[^"]*(")/, `$1${canonicalUrl}$2`);
  };

  app.use(BASE_PATH || '/', express.static(FRONTEND_DIST));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || (BASE_PATH && !req.path.startsWith(BASE_PATH))) {
      return next();
    }
    let routePath = req.path.slice(BASE_PATH.length) || '/';
    if (routePath.length > 1 && routePath.endsWith('/')) routePath = routePath.slice(0, -1);

    res.type('html').send(renderIndexHtml(routePath));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AIPC Full-Stack Server running on port ${PORT}`));