const express = require('express')
const router = express.Router()

const AllUserController = require('../controllers/userController')
const uploads = require('../helper/imageValidate')

const { userAuth, redirectUserIfAuthenticated, userLogout } = require('../middleware/userMiddleware')

const { adminAuth, redirectAdminIfAuthenticated, adminLogout } = require('../middleware/adminMiddleware')


router.get('/', AllUserController.index)
router.get('/about', AllUserController.about)
router.get('/contact', AllUserController.contact)

// REGISTER
router.get('/register/user', AllUserController.signup)
router.post('/register/user', uploads.single('image'), AllUserController.register)

// LOGIN
router.get('/login/user', redirectUserIfAuthenticated, AllUserController.signin)
router.post('/login/user', AllUserController.login)

router.get('/login/user', redirectAdminIfAuthenticated, AllUserController.signin)
router.post('/login/user', AllUserController.login)

// OTP
router.get('/verify-otp', AllUserController.otp)
router.post('/verify-otp', AllUserController.verify_Otp)
router.post('/resend-otp', AllUserController.resend_OTP)

router.post('/logout/user', userLogout)

// User Dashboard (accessible to all authenticated users)
router.get('/user/dashboard', userAuth, AllUserController.user_dashboard)

router.post('/logout/user', userLogout)

// Admin Dashboard 
router.get('/admin/dashboard', adminAuth, AllUserController.admin_dashboard)

router.post('/logout/admin', adminLogout)

// router.post('/logout', AllUserController.logout)



module.exports = router