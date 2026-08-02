const jwt = require('jsonwebtoken');

/**
 * Middleware to verify that the request comes from an authenticated TPO Administrator
 */
module.exports = (req, res, next) => {
  try {
    const adminToken = req.cookies.aipc_admin_session;
    
    if (!adminToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized access. TPO Admin session expired or missing.' 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET || 'fallback_secret');
    
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: Insufficient administrator privileges.' 
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin Auth Middleware Error:', error.message);
    res.clearCookie('aipc_admin_session');
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired admin session token.' 
    });
  }
};