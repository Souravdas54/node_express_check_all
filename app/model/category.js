const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    category_description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }    
}, {
    timestamps: true
})

module.exports = mongoose.model('category', CategorySchema)