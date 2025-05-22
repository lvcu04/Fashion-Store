const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_id: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    categoryName: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },

   
    }, { timestamps: true, versionKey: false });

const Category = mongoose.model('Category', categorySchema, 'category');

module.exports = Category;