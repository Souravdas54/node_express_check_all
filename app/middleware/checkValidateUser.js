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