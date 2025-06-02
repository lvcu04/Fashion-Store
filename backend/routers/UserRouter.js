const express = require('express');

const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route cụ thể trước
router.get('/all', authMiddleware.verifyToken, userController.getAllUser);
router.get('/role', authMiddleware.getRoleByToken, userController.getRole);

// Route động sau cùng
router.get('/:uid', authMiddleware.verifyToken, userController.getUser);

module.exports = router;
