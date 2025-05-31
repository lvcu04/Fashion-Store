const mongoose = require('mongoose');
const { type } = require('os');

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: false,
    default: '',
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    default: 'M',
  },
  condition: {
    type: String,
    enum: ['New', 'Used - Like New', 'Used - Good', 'Used - Acceptable'],
    default: 'Used - Good',
  },
  location: {
    type: String,
  },
  sellerName: {
    type: String,
  },
 category_id: {
  type: String,
  required: true,
},
status: {
  type: String,
  enum: ['Stock', 'UnStock'],
  default: 'Stock',
},
quantity: {
  type: Number,
  required: true,
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

}, { timestamps: true, versionKey: false });

const Product = mongoose.model('Product', productSchema, 'product');
const ProductHot = mongoose.model('ProductHot', productSchema, 'productHot');

module.exports = { Product, ProductHot };