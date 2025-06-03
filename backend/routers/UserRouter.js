const express = require('express');

const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route cụ thể trước
router.get('/all', authMiddleware.AdminRight, userController.getAllUser);
router.get('/role', authMiddleware.getRoleByToken, userController.getRole);

// Route động sau cùng
router.get('/',authMiddleware.VerifyToken, userController.getUser);

module.exports = router;
