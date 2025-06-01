    const mongoose = require('mongoose');

    const transactionSchema = new mongoose.Schema({
        detail_order_id: {
            type: String,
            required: true,
        },
        product_id: {
            type: String,
            required: true,
        },
        order_id: {
            type: String,
            required: true,
        },
        product_name: {
            type: String,
        },
        unit_price: {
            type: Number,
        },
        order_quantity: {
            type: Number,
        },
        subtotal: {
            type: Number,
        },
    }, { timestamps: true, versionKey: false   
    })
    const Transaction = mongoose.model('Transaction', transactionSchema, 'transaction');    

    module.exports = Transaction;