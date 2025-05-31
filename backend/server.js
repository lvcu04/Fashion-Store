const express = require('express');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors'); 
const UserRouter = require('./routers/UserRouter');
const productRouter = require('./routers/ProductRouter');
const categoryRouter = require('./routers/CategoryRouter');
const OrderRouter = require('./routers/OrderRouter');
const transactionRouter = require('./routers/TransactionRouter');
dotenv.config();

const app = express();

// Thêm middleware CORS
const allowedOrigins = [
  'http://192.168.217.1:8081',
  'http://192.168.1.29:8081',
  'http://192.168.218.1:8081',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json());

app.use('/api/user', UserRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/order', OrderRouter); 
app.use('/api/transaction', transactionRouter); 
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to DB:', err);
});
