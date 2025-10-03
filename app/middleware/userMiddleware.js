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
        req.flash('error_msg', 'Please login to access this page.');
        return res.redirect('/login/user');
    }

    const user = verifyToken(userToken);
    if (!user || user.role !== 'user') {
        res.clearCookie('userToken');
        req.flash('error_msg', 'Invalid user session. Please login again.');
        return res.redirect('/login/user');
    }

    req.user = user;
    // req.user = {
    //     _id: user.userId || user._id,
    //     role: user.role || user.role,
    //     name: user.name || user.name,
    //     email: user.email || user.email,
    //     status: user.status || user.status
    // };
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
    req.flash('success_msg', 'User logged out successfully.');
    res.redirect('/login/user');
};

module.exports = {
    userAuth,
    redirectUserIfAuthenticated,
    userLogout
};