  const mongoose = require('mongoose');
  const { isDeepStrictEqual } = require('util');
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
    lowercase: true, 
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  address: [{
    street: { type: String },
    city: { type: String },
    receiverName: { type: String },
  }],
  paymentMethod: [
    {
      type: {
        type: String,
        enum: ['COD', 'MOMO'],
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
    }
  ],
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);
module.exports = User;
