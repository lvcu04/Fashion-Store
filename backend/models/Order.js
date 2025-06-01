const mongoose = require("mongoose");

const OrderProductSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  uid: { type: String, required: true },
  order_date: { type: Date, default: Date.now },
  total_price: { type: Number },
  shipping_address: { type: String },
  payment_method: {
    type: String,
    enum: ["COD", "MOMO", "Stripe", "Credit Card"],
    required: true,
  },
  order_status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered"],
    default: "pending",
  }
}, { timestamps: true, versionKey: false });

const Order = mongoose.model("Order", OrderProductSchema, 'orders');
module.exports = Order;
