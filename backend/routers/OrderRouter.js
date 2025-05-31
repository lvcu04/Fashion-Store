const express = require('express');
const OrderController = require('../controllers/OrderController');
const router = express.Router();
//OrderController
router.get('/allOrders', OrderController.getAllOrders); // http://localhost:5000/api/order/allOrders
router.get('/:order_id', OrderController.getOrderById); // http://localhost:5000/api/order/order_id
router.post('/createOrder', OrderController.createOrder); // http://localhost:5000/api/order/createOrder

module.exports = router;