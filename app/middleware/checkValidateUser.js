const jwt = require('jsonwebtoken');

// Verify token helper
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECURITY_KEY);
    } catch {
        return null;
    }
};

// Middleware to check if user is either admin or regular user
const checkUserOrAdmin = (req, res, next) => {
    // Check if user is logged in as regular user via cookie
    const userToken = req.cookies?.userToken;
    if (userToken) {
        const user = verifyToken(userToken);
        if (user && user.role === 'user') {
            req.user = {
                _id: user.userId || user._id,
                role: user.role,
                name: user.name,
                email: user.email,
                status: user.status
            };
            req.user.role = 'user';
            return next();
        }
    }

    // Check if user is logged in as admin via cookie
    const adminToken = req.cookies?.adminToken;
    if (adminToken) {
        const admin = verifyToken(adminToken);
        if (admin && admin.role === 'admin') {
            req.user = {
                _id: admin.userId || admin._id,
                role: admin.role,
                name: admin.name,
                email: admin.email,
                status: admin.status
            };
            req.user.role = 'admin';
            return next();
        }
    }

    // If not logged in, redirect to login page
    req.flash('error_msg', 'Please login to access this page.');
    res.redirect('/login/user');
};

// Middleware to attach user info to templates
const attachUser = (req, res, next) => {
    // Check user token first
    const userToken = req.cookies?.userToken;
    if (userToken) {
        const user = verifyToken(userToken);
        if (user && user.role === 'user') {
            res.locals.user = {
                _id: user.userId || user._id,
                role: user.role,
                name: user.name,
                email: user.email,
                status: user.status
            };
            res.locals.user.role = 'user';
            return next();
        }
    }

    // Check admin token
    const adminToken = req.cookies?.adminToken;
    if (adminToken) {
        const admin = verifyToken(adminToken);
        if (admin && admin.role === 'admin') {
            res.locals.user = {
                _id: admin.userId || admin._id,
                role: admin.role,
                name: admin.name,
                email: admin.email,
                status: admin.status
            };
            res.locals.user.role = 'admin';
            return next();
        }
    }

    // No user logged in
    res.locals.user = null;
    next();
};

module.exports = { checkUserOrAdmin, attachUser };


// const jwt = require('jsonwebtoken');


// const authMiddleware = async (req, res, next) => {
//     // Check for tokens in both adminToken and userToken cookies
//     const token = req.cookies?.adminToken || req.cookies?.userToken;

//     // console.log('=== AUTH MIDDLEWARE ===');
//     // console.log('Cookies received:', req.cookies);
//     // console.log('Token found:', token ? 'YES' : 'NO');

//     if (!token) {
//         // console.log('No token found, redirecting to login');
//         req.flash('error', 'Please login to access this page.');
//         return res.redirect('/login/user');
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECURITY_KEY);
//         // console.log('Token decoded successfully:', decoded);

//         req.user = decoded;
//         next();

//     } catch (error) {
//         console.error('JWT Verification Error:', error.message);

//         res.clearCookie('adminToken');
//         res.clearCookie('userToken');

//         let errorMessage = 'Session expired. Please login again.';
//         if (error.name === 'JsonWebTokenError') {
//             errorMessage = 'Invalid token. Please login again.';
//         } else if (error.name === 'TokenExpiredError') {
//             errorMessage = 'Session expired. Please login again.';
//         }

//         req.flash('error', errorMessage);
//         return res.redirect('/login/user');
//     }
// };

// const roleMiddleware = (allowedRoles) => {
//     return (req, res, next) => {
//         // console.log('=== ROLE MIDDLEWARE ===');
//         // console.log('User role:', req.user?.role);
//         // console.log('Allowed roles:', allowedRoles);

//         if (!req.user) {
//             req.flash('error', 'Authentication required. Please login.');
//             return res.redirect('/login/user');
//         }

//         if (!allowedRoles.includes(req.user.role)) {
//             // console.log('Access denied for role:', req.user.role);
//             req.flash('error', 'Access denied. Insufficient permissions.');

//             if (req.user.role === 'admin') {
//                 return res.redirect('/admin/dashboard');
//             } else {
//                 return res.redirect('/user/dashboard');
//             }
//         }

//         console.log('Role access granted');
//         next();
//     };
// };

// // Specific role middlewares
// const requireUser = roleMiddleware(['user', 'admin']);
// const requireAdmin = roleMiddleware(['admin']);

// const redirectIfAuthenticated = (req, res, next) => {
//     const token = req.cookies?.adminToken || req.cookies?.userToken;

//     // console.log('=== REDIRECT IF AUTHENTICATED ===');
//     // console.log('Token present:', token ? 'YES' : 'NO');

//     if (token) {
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECURITY_KEY);
//             // console.log('User already authenticated, redirecting to dashboard');

//             if (decoded.role === 'admin') {
//                 return res.redirect('/admin/dashboard');
//             } else {
//                 return res.redirect('/user/dashboard');
//             }
//         } catch (error) {
//             console.log('Invalid token, continuing to login page');
//             next();
//         }
//     } else {
//         console.log('No token, continuing to login page');
//         next();
//     }
// };

// // Remove logout from middleware since you're using controller for logout
// module.exports = {
//     authMiddleware,
//     requireUser,
//     requireAdmin,
//     redirectIfAuthenticated
// };