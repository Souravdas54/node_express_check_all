const multer = require('multer')
const fs = require('fs')
const path = require('path')

// ====== AUTH IMAGE UPLOADS ====== //
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')

        // let folder = './uploads';

        // // Check if route is for products
        // if (req.baseUrl.includes('products')) {
        //     folder = './uploads/products'
        // }


        // // Create folder if not exists
        // if (!fs.existsSync(folder)) {
        //     fs.mkdirSync(folder, { recursive: true })
        // }
        // cb(null, folder)
        
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(null, Error('Only image file are allowed !'), false)
    }
    cb(null, true)
}

const uploads = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter
})

module.exports = uploads

