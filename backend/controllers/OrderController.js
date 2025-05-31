const { get } = require('http');
const OrderProduct = require('../models/OrderProduct');
const Product = require('../models/Product');  
const Transaction = require('../models/Transaction');

const orderController = {
    getAllOrders: async (req, res) => {
        try {
            const orders = await OrderProduct.find();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching orders' });
        }
    },
    getOrderById: async (req, res) => {
        const { order_id } = req.params;
        try {
            const order = await OrderProduct.find({ order_id });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }   
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching order' });
        }
    },
    // createOrder, updateOrder, deleteOrder...
    createOrder: async (req, res) => {
        const { order_id, order_date, total_price, shipping_address, payment_method, order_status, uid, transactions} = req.body;
        try {
                if (!order_id || !uid || !transactions || transactions.length === 0) {    
                    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
                }
                console.log(req.body);
                const exists = await OrderProduct.findOne({ order_id });
                if(exists){
                    return res.status(400).json({ message: 'Đơn hàng đã tồn tại' });
                }
                //tính subtotal và total_price 
                const detailOrders = transaction.map((item, index) => {
                    const subtotal = item.unit_price * item.order_quantity;
                    return {
                        detail_order_id: `D${String(index + 1).padStart(3, '0')}`,
                        order_id,
                        product_id: item.product_id,
                        product_name: item.product_name,
                        unit_price: item.unit_price,
                        order_quantity: item.order_quantity,
                        subtotal
                    };
                });

                const total_price = detailOrders.reduce((total, item) => total + item.subtotal, 0);

                const newOrder = new OrderProduct({
                    order_id,
                    uid,
                    order_date: new Date(),
                    total_price,
                    shipping_address,
                    payment_method,
                    order_status
                });

                await newOrder.save();
                await Transaction.insertMany(detailOrders); // lưu detail vào bảng transaction

                res.status(201).json({
                    message: 'Tạo đơn hàng thành công',
                    order: newOrder,
                    transactions: detailOrders
                });

        } catch (error) {
            return res.status(500).json({ error: 'Error checking order existence' });
        }
    }  
}
module.exports = orderController;