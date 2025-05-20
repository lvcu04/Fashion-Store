const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true, 
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: { type: String, required: true },
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
