const joi = require('joi')

const ValidationSchema = joi.object({

    name: joi.string().min(4).max(30).required(),

    email: joi.string().email().required(),

    gender: joi.string().required(),

    dob: joi.date().less('now').greater('1990-1-1').required(),

    city: joi.string().required(),

    phone: joi.string().pattern(/^[0-9]{10}$/).required(),

    password: joi.string()
        .min(6)
        // .max(20)
        // .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$"))
        // .message(
        //     "Password must be 8-20 characters long, include uppercase, lowercase, number, and special character"
        // )
        .message(
            "Password must be 6 characters long"
        )
        .required(),

    image: joi.string().allow(null, ''), // image may be null if not uploaded

})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})

const otpschema = joi.object({
    otp: joi.string().length(4).pattern(/^[0-9]+$/).required()
})


module.exports = { ValidationSchema, loginSchema, otpschema }