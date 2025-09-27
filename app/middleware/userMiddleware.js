const jwt = require('jsonwebtoken');

// Verify token helper
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECURITY_KEY);
    } catch {
        return null;
    }
};

// User Auth Middleware
const userAuth = (req, res, next) => {
    const userToken = req.cookies?.userToken;
    
    if (!userToken) {
        req.flash('error', 'Please login as user to access this page.');
        return res.redirect('/login/user');
    }

    const user = verifyToken(userToken);
    if (!user || user.role !== 'user') {
        res.clearCookie('userToken');
        req.flash('error', 'Invalid user session. Please login again.');
        return res.redirect('/login/user');
    }

    req.user = user;
    next();
};

// Redirect if user is already logged in
const redirectUserIfAuthenticated = (req, res, next) => {
    const userToken = req.cookies?.userToken;
    const user = verifyToken(userToken);
    
    if (user && user.role === 'user') {
        return res.redirect('/user/dashboard');
    }
    next();
};

// User logout - only clears user token
const userLogout = (req, res) => {
    res.clearCookie('userToken');
    req.flash('success', 'User logged out successfully.');
    res.redirect('/login/user');
};

module.exports = {
    userAuth,
    redirectUserIfAuthenticated,
    userLogout
};