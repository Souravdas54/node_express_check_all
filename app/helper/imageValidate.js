const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
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