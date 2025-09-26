const fs = require('fs')
const path = require('path')
const User = require('../model/userModel')
const { ValidationSchema } = require('../helper/userValidation')

class AllUserController {

    async signup(req, res) {
        res.render('auth/register', {
            title: "Register"
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

            //  If you are uploading file with multer, attach it to body

            if (req.file) {
                value.image = req.file.path.replace(/\\/g, '/')
            } else {
                value.image = null;
            }

            // Save user to DB
            const user = new User(value)
            await user.save()

            res.status(201).json({
                success: true,
                message: "Register successfully",
                data: user
            })
            return res.redirect('/register/user')

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
}

module.exports = new AllUserController()