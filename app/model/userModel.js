const { boolean } = require('joi')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    gender: { type: String, required: true },

    dob: { type: Date, required: true },

    city: { type: String, required: true },

    phone: { type: String, required: true },

    image: { type: String, required: true },

    role: { type: String, enum: ['user', 'admin', 'editor'], default: 'user' },

    is_verified: { type: Boolean, default: false }

}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('user', UserSchema)