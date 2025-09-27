
const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },

    email: { type: String, required: true },

    gender: { type: String, required: true },

    dob: { type: Date, required: true },

    city: { type: String, required: true },

    phone: { type: String, required: true },

    image: { type: String, required: true },

    password: { type: String, required: true },

    is_verified: { type: Boolean, default: false },

    role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },

    status: {
        type: String,
        enum: ['active', 'inactive', 'locked'],
        default: 'active'
    },

    failed_login_attempts: { type: Number, default: 0 },
    last_failed_login: { type: Date },
    last_login: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

}, {
    timestamps: true,
    versionKey: false
})

// Update timestamp before saving
UserSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('user', UserSchema)