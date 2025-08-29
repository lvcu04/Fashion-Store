const express = require('express');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

const UserRouter = require('./routers/UserRouter');
const productRouter = require('./routers/ProductRouter');
const categoryRouter = require('./routers/CategoryRouter');
const OrderRouter = require('./routers/OrderRouter');
const CartRouter = require('./routers/CartRouter');
// const StripeRoute = require('./routers/StripeRoute');
// const StripeWebhookHandler = require('./routers/StripeWebhookHandler');

const momoRoutes = require('./routers/momoRouter');

dotenv.config();

const app = express(); 
app.use(express.json());

// ✅ Route đơn giản test
app.get('/success', (req, res) => {
  res.send('✅ Thanh toán thành công! Stripe đã xử lý.');
});

app.get('/cancel', (req, res) => {
  res.send('❌ Thanh toán bị hủy.');
});

// ✅ Các API chính
app.use('/api/user', UserRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/order', OrderRouter);
app.use('/api/momo', momoRoutes);
app.use('/api/cart', CartRouter);

const PORT = process.env.PORT || 5000;

// chỉ start server khi chạy trực tiếp, để test thì export app
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error('❌ Failed to connect to DB:', err);
  });
}

module.exports = app; // 👈 export cho Jest dùng
