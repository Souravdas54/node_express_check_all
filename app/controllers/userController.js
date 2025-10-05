const fs = require('fs')
const path = require('path')
const User = require('../model/userModel')
const OTP = require('../model/otpModel')
const { ValidationSchema } = require('../helper/userValidation')
const HashPassword = require('../helper/hashPassword')
const SendOtpEmail = require('../helper/emailHelper')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


class AllUserController {

    async index(req, res) {
        res.render('index', {
            title: 'Premium Shopping Destination - Amazing Products & Deals',
            description: 'Welcome to your premium shopping destination. Discover amazing products at unbeatable prices. Shop now for the best deals!',
            canonicalUrl: '/',
            ogImage: '/image/image.png',
            pageType: 'website',

            user: req.user || null,
        })
    }

    async about(req, res) {
        res.render('about', {
            title: 'About Us - Premium Shopping Experience',
            description: 'Learn about our mission to provide quality products at affordable prices. Your satisfaction is our priority.',
            canonicalUrl: '/about',
            ogImage: '/image/image.png',
            pageType: 'website',
            user: req.user || null,
        })
    }

    async contact(req, res) {
        res.render('contact', {
            title: 'Contact Us - Get in Touch | PremiumShop',
            description: 'Have questions? Contact our customer service team. We are here to help you with your shopping experience.',
            canonicalUrl: '/contact',
            ogImage: '/image/image.png',
            pageType: 'website',

            user: req.user || null,
        })
    }

    async signin(req, res) {
        res.render('auth/login', {
            title: 'Login to Your Account - PremiumShop',
            description: 'Sign in to your PremiumShop account to manage orders, track shipments, and access exclusive member deals.',
            ogImage: '/image/image.png',
            pageType: 'website',

            user: req.user || null,
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg')
        })
    }

    async signup(req, res) {
        res.render('auth/register', {
            title: 'Create Account - Join PremiumShop',
            description: 'Create your PremiumShop account to access exclusive deals, faster checkout, and personalized shopping experience.',
            ogImage: '/image/image.png',
            pageType: 'website',
            user: req.user || null,

        })
    }

    async register(req, res) {
        console.log(req.body);

        try {
            const { error, value } = ValidationSchema.validate(req.body, { abortEarly: false })

            if (error) {
                if (req.file) {
                    const filePath = path.resolve(req.file.path); // absolute path
                    fs.unlink(filePath, (err) => {
                        if (err) console.error("Failed to delete file:", err);
                        else console.log("Deleted unused file:", filePath);
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    error: error.details.map(err => err.message)
                })
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email: value.email });
            if (existingUser) {
                if (req.file) {
                    const filePath = path.resolve(req.file.path);
                    fs.unlink(filePath, (err) => {
                        if (err) console.error("Failed to delete file:", err);
                        else console.log("Deleted unused file:", filePath);
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: "User already exists with this email"
                });
            }

            //  If you are uploading file with multer, attach it to body
            if (req.file) {
                value.image = req.file.path.replace(/\\/g, '/')
            } else {
                value.image = null;
            }

            // Hash password
            value.password = await HashPassword(value.password)

            // Save user to DB
            const user = new User(value)
            await user.save()

            await SendOtpEmail(user.email, user)

            return res.redirect(`/verify-otp?userId=${user._id}`)
            // return res.redirect('/login/user')

        } catch (error) {

            if (req.file) {
                const filePath = path.resolve(req.file.path);

                fs.unlink(filePath, (err) => {
                    if (err) console.error("❌ Failed to delete file:", err);
                    else console.log("🗑️ Deleted unused file:", filePath);
                });
            }

            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            })
        }
    }

    async otp(req, res) {
        const userId = req.query.userId;
        if (!userId) {
            return res.redirect('/register');
        }
        res.render('auth/otp', {
            userId: userId
        });

        // res.render('auth/otp', {
        //     title: 'OTP Verification',

        //     success_msg: req.flash('success_msg'),
        //     error_msg: req.flash('error_msg')
        // })
    }

    async verify_Otp(req, res) {
        try {
            const { userId, otp } = req.body;

            // Validate input
            if (!userId || !otp) {
                return res.status(400).json({
                    success: false,
                    message: "User ID and OTP are required"
                });
            }

            // Find the OTP in database
            const otpRecord = await OTP.findOne({
                userId: userId,
                otp: otp
            });
            if (!otpRecord) {
                req.flash('error_msg', 'Invalid OTP or OTP expired');

                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP or OTP expired"
                });
            }
            // Update user's verification status
            await User.findByIdAndUpdate(userId, {
                is_verified: true
            });
            // Delete the OTP record after successful verification
            await OTP.deleteOne({ _id: otpRecord._id });

            // Redirect to login page
            return res.redirect('/login/user');
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    async resend_OTP(req, res) {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required"
                });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Send new OTP
            const otpSent = await SendOtpEmail(user.email, user);

            if (otpSent) {
                return res.json({
                    success: true,
                    message: "OTP sent successfully"
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: "Failed to send OTP"
                });
            }

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }


    async login(req, res) {
        console.log('Login request body:', req.body);

        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                req.flash('error_msg', 'Please provide both email and password');
                return res.redirect('/login/user');
            }

            const user = await User.findOne({ email });
            // console.log('User found:', user);

            // Check if user exists
            if (!user) {
                req.flash('error_msg', 'Invalid email or password');
                return res.redirect('/login/user');
            }

            // Check if user is verified
            if (!user.is_verified) {
                req.flash('error_msg', 'Please verify your email before logging in');
                return res.redirect('/login/user');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Password validation result:', isPasswordValid);

            if (!isPasswordValid) {
                user.failed_login_attempts = (user.failed_login_attempts || 0) + 1;
                user.last_failed_login = new Date();
                await user.save();

                req.flash('error_msg', 'Invalid email or password');
                return res.redirect('/login/user');
            }

            // Reset failed login attempts
            user.failed_login_attempts = 0;
            user.last_login = new Date();
            await user.save();

            console.log('User role:', user.role);

            // Create JWT token
            const token = jwt.sign(
                {
                    userId: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    dob: user.dob,
                    phone: user.phone,
                    city: user.city,
                    image: user.image,
                    role: user.role || 'user',
                    status: user.status
                },
                process.env.JWT_SECURITY_KEY,
                { expiresIn: '24h' }
            );

            console.log('Token generated successfully');

            // Set cookie and redirect based on role
            if (user.role === 'admin') {
                res.cookie('adminToken', token, {
                    httpOnly: true,
                    secure: false, // Set to false for development
                    maxAge: 24 * 60 * 60 * 1000 // 24 hours
                    // maxAge: 30 * 60 * 1000 // 30 minutes
                });
                req.flash('success_msg', `Welcome back, ${user.name || 'Admin'}!`);
                console.log('Setting admin cookie and redirecting...');
                return res.redirect('/admin/dashboard');
            } else {
                res.cookie('userToken', token, {
                    httpOnly: true,
                    secure: false, // Set to false for development
                    maxAge: 24 * 60 * 60 * 1000
                });
                req.flash('success_msg', `Welcome back, ${user.name || 'User'}!`);
                console.log('Setting user cookie and redirecting...');
                return res.redirect('/user/dashboard');
            }

        } catch (error) {
            console.error('Login error:', error);
            req.flash('error_msg', 'Server error during login. Please try again.');
            return res.redirect('/login/user');
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('adminToken');
            res.clearCookie('userToken');
            req.flash('success', 'Logged out successfully.');
            res.redirect('/login/user');
        } catch (error) {
            console.error('Logout error:', error);
            res.redirect('/login/user');
        }
    }


    // In your controller
    async user_dashboard(req, res) {

        try {
            // console.log('User image path:', req.user?.image);

            res.render('dashboads/userdashboard', {
                title: 'User Dashboard',
                user: req.user
            })
        } catch (error) {
            console.error('Dashboard error:', error);
            res.redirect('/login/user');
        }

    }

    async admin_dashboard(req, res) {
        res.render('dashboads/admindashboard', {
            title: 'Admin Dashboard',
            user: req.user
        })
    }



}

module.exports = new AllUserController()