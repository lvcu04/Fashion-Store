const express = require('express');

const userController = require('../controllers/Usercontroller');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.get('/all', authMiddleware.verifyToken, userController.getAllUser);
router.get('/', userController.getUser)
router.get('/role', authMiddleware.getRoleByToken,userController.getRole);

module.exports = router;
