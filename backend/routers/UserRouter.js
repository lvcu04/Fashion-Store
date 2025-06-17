const express = require('express');

const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route cụ thể trước
router.get('/all', authMiddleware.AdminRight, userController.getAllUser);
router.get('/role', authMiddleware.getRoleByToken, userController.getRole);
router.post('/register',userController.register);
// Route động sau cùng
router.get('/',authMiddleware.VerifyToken, userController.getUser);
//SHIPPING ADDRESS
router.get('/getAddress',authMiddleware.VerifyToken, userController.getAllShippingAddressUid);// http://localhost:5000/api/user/getShippingAddress
router.post('/createAddress',authMiddleware.VerifyToken, userController.createShippingAddress); // http://localhost:5000/api/user/createShippingAddress
router.put('/updateAddress',authMiddleware.VerifyToken, userController.editAddress); // http://localhost:5000/api/user/updateAddress
router.delete('/removeAddress',authMiddleware.VerifyToken, userController.removeAddress); // http://localhost:5000/api/user/deleteShippingAddress
//PAYMENT METHOD
router.get('/getPaymentMethod',authMiddleware.VerifyToken, userController.getPaymentMethod); // http://localhost:5000/api/user/getPaymentMethod
router.get('/getPaymentMethodSetTrue',authMiddleware.VerifyToken, userController.getPaymentMethodSetTrue); // http://localhost:5000/api/user/getPaymentMethodSetTrue
router.post('/addPaymentMethod',authMiddleware.VerifyToken, userController.addPaymentMethod); // http://localhost:5000/api/user/addPaymentMethod
router.put('/updatePaymentMethod',authMiddleware.VerifyToken, userController.updatePaymentMethod); // http://localhost:5000/api/user/updatePaymentMethod
module.exports = router;
