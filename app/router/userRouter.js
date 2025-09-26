const express = require('express')
const router = express.Router()

const AllUserController = require('../controllers/userController')
const uploads = require('../helper/imageValidate')

router.get('/register/user',AllUserController.signup)
router.post('/register/user', uploads.single('image'), AllUserController.register)

module.exports = router