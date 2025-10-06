const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

// ====== AUTH IMAGE UPLOADS ====== //
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads')

//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// })

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'users',
        allow_format: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
})

// const fileFilter = (req, file, cb) => {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//         return cb(null, Error('Only image file are allowed !'), false)
//     }
//     cb(null, true)
// }

const uploads = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2 },
    // fileFilter
})

module.exports = uploads

