const mongoose = require("mongoose");

const OrderProductSchema = new mongoose.Schema({
  order_id: {
    type: String,
  },

  uid: {
    type: String,
    required: true,
  },

  order_date: {
    type: Date,
    default: Date.now,
  },

  cartItems: [
    {
      product_id: {
        type: String,
        trim: true,
      },
      productName: {
        type: String,
      },
      image: {
        type: String,
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
    }
  ],

  total_price: {
    type: Number,
  },

  shipping_address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    receiverName: { type: String, required: true },
  },

  payment_method: {
    type: String,
    enum: ["COD", "MOMO", "Stripe", "Credit Card"],
  },

  order_status: {
    type: String,
    enum: ["pending", "paid", "success", "delivered", "cancelled"],
    default: "pending",
  },

}, { timestamps: true, versionKey: false });

const Order = mongoose.model("Order", OrderProductSchema, 'orders');
module.exports = Order;
