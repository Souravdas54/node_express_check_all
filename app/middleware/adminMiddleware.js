const jwt = require('jsonwebtoken');

// Verify token helper
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECURITY_KEY);
    } catch {
        return null;
    }
};

// Admin Auth Middleware
const adminAuth = (req, res, next) => {
    const adminToken = req.cookies?.adminToken;
    
    if (!adminToken) {
        req.flash('error', 'Please login as admin to access this page.');
        return res.redirect('/login/user');
    }

    const admin = verifyToken(adminToken);
    if (!admin || admin.role !== 'admin') {
        res.clearCookie('adminToken');
        req.flash('error', 'Invalid admin session. Please login again.');
        return res.redirect('/login/user');
    }

    req.user = admin;
    next();
};

// Redirect if admin is already logged in
const redirectAdminIfAuthenticated = (req, res, next) => {
    const adminToken = req.cookies?.adminToken;
    const admin = verifyToken(adminToken);
    
    if (admin && admin.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }
    next();
};

// Admin logout - only clears admin token
const adminLogout = (req, res) => {
    res.clearCookie('adminToken');
    req.flash('success', 'Admin logged out successfully.');
    res.redirect('/login/user');
};

module.exports = {
    adminAuth,
    redirectAdminIfAuthenticated,
    adminLogout
};