const express = require('express')
const router = express.Router()

const AllCategory = require('../controllers/category')
const AllProduct = require('../controllers/product')
const  uploads  = require('../helper/imageValidate')
const { adminAuth } = require('../middleware/adminMiddleware')

// ========== CATEGORY ============ //
router.get('/category', adminAuth, AllCategory.category)

router.post('/category/create', adminAuth, AllCategory.create_category)

// ========== PRODUCT ============ //
router.get('/product', adminAuth, AllProduct.product)

router.post('/product/create', adminAuth, uploads.single('image'), AllProduct.create_product)

router.get('/product/details', adminAuth, AllProduct.product_list)



module.exports = router