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
    address: [{
      street: { type: String, required: true },
      city: { type: String, required: true },
      receiverName: { type: String, required: true },
    }],
    paymentMethod: [
      {
        type: {
          type: String,
          enum: ['COD', 'MOMO'], // liệt kê các phương thức hợp lệ
          required: true,
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
  }
  , { timestamps: true, versionKey: false });

  const User = mongoose.model('User', userSchema);
  module.exports = User;
