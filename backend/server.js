const express = require('express');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const UserRouter = require('./routers/userRouter');
const productRouter = require('./routers/ProductRouter');
const categoryRouter = require('./routers/CategoryRouter');
// Load biến môi trường
dotenv.config();

// Tạo app express
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/user', UserRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);

// Khởi chạy server sau khi kết nối DB
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to DB:', err);
});
