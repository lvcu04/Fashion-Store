const express = require('express');
const TransactionController = require('../controllers/TransactionController');
const router = express.Router();
//transactionController
router.get('/allTransactions', TransactionController.getAllTransactions); // http://localhost:5000/api/transaction/allTransactions
module.exports = router;