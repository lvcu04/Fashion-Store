const express = require('express');
const router = express.Router();
const { createPayment, handleIpn } = require('../controllers/momoControllder');


router.post('/create', createPayment); //http://localhost:5000/api/momo/create
router.post('/ipn', handleIpn);

module.exports = router;

