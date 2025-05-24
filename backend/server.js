const express = require('express');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors'); // Thêm dòng này
const UserRouter = require('./routers/userRouter');
const productRouter = require('./routers/ProductRouter');
const categoryRouter = require('./routers/CategoryRouter');

dotenv.config();

const app = express();

// Thêm middleware CORS
app.use(cors({
  origin: 'http://192.168.217.1:8081', // Cho phép gọi từ React app
  credentials: true,
}));

app.use(express.json());

app.use('/api/user', UserRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to DB:', err);
});
