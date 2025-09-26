const joi = require('joi')

const ValidationSchema = joi.object({

    name: joi.string().min(4).max(30).required(),

    email: joi.string().email().required(),

    gender: joi.string().required(),

    dob: joi.date().less('now').greater('1990-1-1').required(),

    city: joi.string().required(),

    phone: joi.string().pattern(/^[0-9]{10}$/).required(),

    image: joi.string().allow(null, '') // image may be null if not uploaded
})



module.exports = { ValidationSchema }