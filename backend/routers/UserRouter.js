const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const userController = require('../controllers/Usercontroller');


const router = express.Router();

router.get('/all', verifyToken, userController.getAllUser);
router.get('/',userController.getUser)

module.exports = router;
