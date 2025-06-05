const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    trim: true,
  },
  productName: {
    type: String,
  },
  image: {
    type: String,
    required: false,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
  type: Number,
  required: true,
},
});

const cartSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema, 'cart');
module.exports = Cart;
