const mongoose = require("mongoose");

const OrderProductSchema = new mongoose.Schema({
 order_id: {
     type: String,
     required: true,
 },
 order_date: {
     type: Date,
 },
 total_price: {
     type: Number,
 },
 shipping_address: {
     type: String,
 },
 payment_method: {
     type: String,
     enum: ["COD", "MOMO"],
 },
 order_status: {
     type: String,
 },
 uid: {
     type: String,
     required: true,
 }
})
const Order = mongoose.model("Order", OrderProductSchema, 'orders');
module.exports = Order;