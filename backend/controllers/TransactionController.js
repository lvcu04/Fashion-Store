const Transaction = require('../models/Transaction');

const TransactionController = {
  getTransactionsByOrderId: async (req, res) => {
    const { order_id } = req.params;
    try {
      const transactions = await Transaction.find({ order_id });
      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: 'Không có chi tiết nào cho đơn hàng này' });
      }
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi truy vấn chi tiết đơn hàng', detail: error.message });
    }
  },

  getAllTransactions: async (req, res) => {
    try {
      const all = await Transaction.find();
      res.status(200).json(all);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi truy vấn danh sách chi tiết đơn hàng' });
    }
  }
};

module.exports = TransactionController;
