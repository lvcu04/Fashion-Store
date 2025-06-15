
const crypto = require('crypto');
const axios = require('axios');
const Order = require('../models/Order');
// const Transaction = require('../models/Transaction');
const Cart = require('../models/Cart');
const { Product } = require('../models/Product');

const createPayment = async (req, res) => {
  const {
    MOMO_PARTNER_CODE,
    MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY,
    MOMO_API_URL,
    MOMO_REDIRECT_URL,
    MOMO_IPN_URL
  } = process.env;//khai báo các biến môi trường MOMO

  const { uid, total_price, shipping_address } = req.body;
  const orderId = MOMO_PARTNER_CODE + Date.now();
  const requestId = orderId;
  const orderInfo = 'Thanh toan don hang Momo';
  const requestType = 'captureWallet';
  const extraData = '';
  const autoCapture = true;
  const lang = 'vi';

  try {
    console.log("🛒 Đang kiểm tra giỏ hàng cho UID:", uid);

    // 🔍 1. Lấy giỏ hàng trước khi tạo đơn hàng
    const userCart = await Cart.findOne({ uid });

    if (!userCart || !userCart.items || userCart.items.length === 0) {
      console.log("❗ Giỏ hàng trống hoặc không tìm thấy");
      return res.status(400).json({ error: 'Cart is empty or not found' });
    }

    const cartItems = userCart.items;
    console.log("✅ Giỏ hàng:", cartItems);
    
      // 3. Trừ số lượng sản phẩm trong kho
      for (const item of cartItems) {
        const product = await Product.findOne({ product_id: item.product_id });
        if (product) {
          console.log(`🔄 Cập nhật tồn kho cho sản phẩm: ${item.product_id}`);
          product.quantity -= item.quantity;
          if (product.quantity < 0) product.quantity = 0;
          await product.save();
          console.log(`✅ Đã cập nhật tồn kho: còn ${product.quantity}`);
        } else {
          console.log(`❌ Không tìm thấy sản phẩm: ${item.product_id}`);
        }
      }

    // 🧾 2. Tạo đơn hàng với trạng thái "pending", có cartItems
    await Order.create({
      order_id: orderId,
      uid,
      total_price,
      shipping_address,
      payment_method: 'MOMO',
      order_status: 'pending',
      cartItems // 🟢 Thêm giỏ hàng vào đơn
    });
    console.log("✅ Đã tạo đơn hàng với trạng thái pending:", orderId);

    // 🔐 3. Tạo chữ ký Momo
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

    console.log("✅ MoMo response:", momoResponse.data);
    res.status(200).json(momoResponse.data);
  } catch (error) {
    console.error('❌ Momo payment error:', error);
    res.status(500).json({ error: error.message || 'Lỗi thanh toán với Momo' });
  }
};

// const handleIpn = async (req, res) => {
//   const {
//     orderId,
//     resultCode,
//     amount,
//     message,
//     transId
//   } = req.body;

//   try {
//     console.log("📩 IPN received:", req.body);

//     if (resultCode === 0) {
//       console.log("✅ Thanh toán thành công. Cập nhật đơn hàng:", orderId);

//       // 1. Cập nhật trạng thái đơn hàng
//       await Order.findOneAndUpdate({ order_id: orderId }, { order_status: 'paid' });

//       // 2. Lấy lại thông tin đơn hàng đã chứa cartItems
//       const order = await Order.findOne({ order_id: orderId });
//       const uid = order.uid;
//       const cartItems = order.cartItems || [];

//       if (!cartItems || cartItems.length === 0) {
//         console.log("❗ Đơn hàng không chứa sản phẩm");
//         return res.status(400).json({ error: 'Order does not contain cart items' });
//       }

//     } else {
//       console.log(`❌ Thanh toán thất bại. Cập nhật trạng thái 'failed' cho đơn hàng: ${orderId}`);
//       await Order.findOneAndUpdate({ order_id: orderId }, { order_status: 'failed' });
//     }

//     res.status(200).json({ message: 'IPN received' });
//   } catch (err) {
//     console.error('❌ IPN xử lý thất bại:', err.message);
//     res.status(500).json({ error: 'IPN handle failed', detail: err.message });
//   }
// };

module.exports = {
  // handleIpn,
  createPayment
};

