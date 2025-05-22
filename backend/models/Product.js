const mongoose = require('mongoose');

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
}

}, { timestamps: true, versionKey: false });

const Product = mongoose.model('Product', productSchema, 'product');
const ProductHot = mongoose.model('ProductHot', productSchema, 'productHot');

module.exports = { Product, ProductHot };