const mongoose = require('mongoose')

const OtpSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 // OTP expires after 60 seconds (1 minute)
    }

}, {
    timestamps: true,
    versionKey: false
})

// OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('otp', OtpSchema)