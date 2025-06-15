const express = require('express');
const OrderController = require('../controllers/OrderController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
//OrderController
router.get('/getAllOrders',authMiddleware.AdminRight, OrderController.getAllOrders); // http://localhost:5000/api/order/getOrder/:order_id
router.get('/getAllOrdersUid',authMiddleware.VerifyToken, OrderController.getAllOrdersUid); // http://localhost:5000/api/order/allOrders
router.get('/getOrder/:order_id',authMiddleware.VerifyToken, OrderController.getOrderByOrderId); // http://localhost:5000/api/order/getOrder/:order_id
router.post('/createOrder',authMiddleware.VerifyToken, OrderController.CreateOrderFormCart) ; // http://localhost:5000/api/order/createOrder
router.delete('/cancel/:order_id',authMiddleware.VerifyToken, OrderController.cancelOrder);
router.put('/editOrderStatus/:order_id',authMiddleware.AdminRight, OrderController.editOrderStatus); //http://localhost:5000/api/order/editOrderStatus/:order_id
router.get('/success',authMiddleware.VerifyToken,OrderController.getOrderSuccess) //  http://localhost:5000/api/order/success
router.get('/delivery',authMiddleware.VerifyToken,OrderController.getOrderDeliverry)// http://localhost:5000/api/order/delivery
router.get('/cancel',authMiddleware.VerifyToken,OrderController.getOrderCancel) // http://localhost:5000/api/order/cancel
router.get('/paid',authMiddleware.VerifyToken,OrderController.getOrderPaid) // http://localhost:5000/api/order/cancel
module.exports = router;