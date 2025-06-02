const express = require('express');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

const UserRouter = require('./routers/UserRouter');
const productRouter = require('./routers/ProductRouter');
const categoryRouter = require('./routers/CategoryRouter');
const OrderRouter = require('./routers/OrderRouter');
const transactionRouter = require('./routers/TransactionRouter');
// const StripeRoute = require('./routers/StripeRoute');
// const StripeWebhookHandler = require('./routers/StripeWebhookHandler');

const momoRoutes = require('./routers/momoRouter');

dotenv.config();

const app = express(); 
// ✅ Route webhook riêng - cần raw body
// app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), StripeWebhookHandler);
// ✅ Parse JSON body trước khi vào các route bình thường
app.use(express.json());



// Thêm middleware CORS 
const allowedOrigins = [ 'http://192.168.217.1:8081', 'http://192.168.1.29:8081', 'http://192.168.218.1:8081', ]; app.use(cors({ origin: function (origin, callback) { if (!origin || allowedOrigins.includes(origin)) { callback(null, true); } else { callback(new Error('Not allowed by CORS')); } }, credentials: true, }));

// ✅ Route tạo session thanh toán
// app.use('/api/stripe', StripeRoute);



// ✅ Route đơn giản hiển thị thành công/hủy
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
app.use('/api/transaction', transactionRouter);
app.use('/api/momo', momoRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to DB:', err);
});
