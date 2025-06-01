// controllers/momo.controller.js
const crypto = require('crypto');
const axios = require('axios');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

const createPayment = async (req, res) => {
  const {
    MOMO_PARTNER_CODE,
    MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY,
    MOMO_API_URL,
    MOMO_REDIRECT_URL,
    MOMO_IPN_URL
  } = process.env;

  const { uid, products, total_price, shipping_address } = req.body;
  const orderId = MOMO_PARTNER_CODE + Date.now();
  const requestId = orderId;
  const orderInfo = 'Thanh toan don hang Momo';
  const requestType = 'captureWallet';
  const extraData = '';
  const autoCapture = true;
  const lang = 'vi';

  try {
    // 1. Save Order with "pending" status
    await Order.create({
      order_id: orderId,
      uid,
      total_price,
      shipping_address,
      payment_method: 'MOMO',
      order_status: 'pending'
    });

    // 2. Generate MoMo signature
    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${total_price}&extraData=${extraData}&ipnUrl=${MOMO_IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${MOMO_REDIRECT_URL}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', MOMO_SECRET_KEY).update(rawSignature).digest('hex');

    const requestBody = {
      partnerCode: MOMO_PARTNER_CODE,
      partnerName: 'MoMoTest',
      storeId: 'Store001',
      requestId,
      amount: total_price,
      orderId,
      orderInfo,
      redirectUrl: MOMO_REDIRECT_URL,
      ipnUrl: MOMO_IPN_URL,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature
    };

    const momoResponse = await axios.post(`${MOMO_API_URL}/v2/gateway/api/create`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
      },
      data: requestBody
    });

    res.status(200).json(momoResponse.data);
  } catch (error) {
    console.error('Momo payment error:', error);
    res.status(500).json({ error: error.message || 'Lỗi thanh toán với Momo' });
  }
};

const handleIpn = async (req, res) => {
  const {
    orderId,
    resultCode,
    amount,
    message,
    transId
  } = req.body;

  try {
    if (resultCode === 0) {
      // 1. Update order to paid
      await Order.findOneAndUpdate({ order_id: orderId }, { order_status: 'paid' });

      // 2. Create transaction for each product
      const order = await Order.findOne({ order_id: orderId });
      const { products } = req.body;

      if (products && Array.isArray(products)) {
        const transactions = products.map(p => ({
          detail_order_id: transId,
          product_id: p.product_id,
          order_id: orderId,
          product_name: p.product_name,
          unit_price: p.unit_price,
          order_quantity: p.quantity,
          subtotal: p.unit_price * p.quantity
        }));
        await Transaction.insertMany(transactions);
      }
    } else {
      await Order.findOneAndUpdate({ order_id: orderId }, { order_status: 'failed' });
    }

    res.status(200).json({ message: 'IPN received' });
  } catch (err) {
    res.status(500).json({ error: 'IPN handle failed', detail: err.message });
  }
};

module.exports = {
  handleIpn,
  createPayment
};
