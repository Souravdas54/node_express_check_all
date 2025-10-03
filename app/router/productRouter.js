const express = require('express')
const router = express.Router()

const AllCategory = require('../controllers/category')
const AllProduct = require('../controllers/product')
const uploads = require('../helper/imageValidate')
const { adminAuth } = require('../middleware/adminMiddleware')
// const { userAuth } = require('../middleware/userMiddleware')

const { checkUserOrAdmin } = require('../middleware/checkValidateUser')

// ========== CATEGORY ============ //
router.get('/category', adminAuth, AllCategory.category)

router.post('/category/create', adminAuth, AllCategory.create_category)

// ========== PRODUCT ============ //
router.get('/product', adminAuth, AllProduct.product)

router.get('/product/edit/:id', adminAuth, AllProduct.product_edit)

router.post('/product/create', adminAuth, uploads.single('image'), AllProduct.create_product)

// Product details - accessible to both users and admins (requires login)
router.get('/product/details', checkUserOrAdmin, AllProduct.product_list)

router.post('/product/edit/:id', adminAuth, uploads.single('image'), AllProduct.edit_product)

router.delete('/product/delete/:id', adminAuth, AllProduct.delete_product)



module.exports = router