const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({

    product_name: { type: String, required: true, trim: true },

    category_id: { type: mongoose.Types.ObjectId, ref: 'category', required: true },

    price: { type: Number, required: true, trim: true },

    color: { type: [String], required: true, trim: true },

    description: { type: String, required: true, trim: true },

    quantity: { type: Number, required: true, trim: true },

    image: { type: String, required: true },

    brand: { type: String, trim: true },

    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }

})

module.exports = mongoose.model('product', ProductSchema)