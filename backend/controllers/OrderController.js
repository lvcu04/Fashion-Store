const { get } = require('http');
const Order = require('../models/Order');
const User = require('../models/User');
const {Product} = require('../models/Product');  
// const Transaction = require('../models/Transaction');
const Cart = require('../models/Cart');
const {v4: uuidv4} = require('uuid');
const { error } = require('console');

const orderController = {
    CreateOrderFormCart: async (req, res) => {
    try {
        const { uid } = req.user;
        const { total_price, shipping_address, payment_method, order_status } = req.body;

        console.log("✅ [Step 1] Nhận yêu cầu tạo đơn hàng");

        // Lấy giỏ hàng từ MongoDB
        const userCart = await Cart.findOne({ uid });
        console.log("🛒 Lấy giỏ hàng cho user:", userCart);

        if (!userCart || !userCart.items || userCart.items.length === 0) {
            console.log("❗ Không tìm thấy giỏ hàng hoặc giỏ hàng trống");
            return res.status(400).json({ error: 'Cart is empty or not found' });
            }


        const cartItems = userCart.items;

        console.log("📦 cartItems:", cartItems);
        console.log("💰 total_price:", total_price);
        console.log("📬 shipping_address:", shipping_address);
        console.log("💳 payment_method:", payment_method);
        console.log("📌 order_status:", order_status);

        if (!uid || !total_price || !shipping_address || !payment_method || !order_status) {
            console.log("❗ Thiếu thông tin bắt buộc khi tạo đơn hàng");
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const order_id = uuidv4();
        console.log("🆔 Tạo order_id:", order_id);

        const newOrder = new Order({
            order_id,
            uid,
            cartItems,
            total_price,
            shipping_address,
            payment_method,
            order_status
        });

        await newOrder.save();
        console.log("✅ show don hang vào database:", newOrder,shipping_address);
        console.log("✅ Đã lưu đơn hàng vào database");

        // Trừ số lượng sản phẩm trong kho
        for (const item of cartItems) {
            const product = await Product.findOne({ product_id: item.product_id });
            if (product) {
                console.log(`🔄 Cập nhật tồn kho cho sản phẩm: ${item.product_id}`);
                product.quantity -= item.quantity;
                if (product.quantity < 0) product.quantity = 0;
                await product.save();
                console.log(`✅ Đã cập nhật tồn kho: còn ${product.quantity}`);
            } else {
                console.log(`❌ Không tìm thấy sản phẩm: ${item.product_id}`);
            }
        }

        // // Xóa giỏ hàng
        // await Cart.findOneAndDelete({ uid });
        // console.log("🗑️ Đã xóa giỏ hàng sau khi đặt hàng");

        res.status(200).json({ message: 'Order placed successfully' });
        console.log("🎉 Đơn hàng được đặt thành công");

    } catch (error) {
        console.error('❌ Lỗi tạo đơn hàng:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    },
    //lấy tất cả đơn hàng của tất cả người dùng 
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find().sort({ createdAt: -1 }); // sắp xếp mới nhất trước
            res.status(200).json(orders);
            console.log("✅ Đã lấy tất cả đơn hàng", orders);
        } catch (error) {
            console.error("❌ Error fetching orders:", error);
            res.status(500).json({ error: 'Error fetching orders' });
        }
    },
    getOrderByOrderId: async (req, res) => {
        const { order_id } = req.params;
        try {
            const orderId = await Order.findOne({order_id});
            if (orderId) {
                res.status(200).json(orderId);
                console.log("✅ Đã lấy đơn hàng", orderId);
            }
        } catch (error) {
            console.log("❌ Error fetching order:", error);
            res.status(500).json({ error: 'Error fetching order' });
        }
    },
    //lấy tất cả đơn hàng của người dùng có chung uid
    getAllOrdersUid: async (req, res) => {
        const { uid } = req.user;
        if (!uid) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const orders = await Order.find({uid}).sort({ createdAt: -1 }); // sắp xếp mới nhất trước
            res.status(200).json(orders);
            console.log("✅ Đã lấy tất cả đơn hàng", orders);
        } catch (error) {
            console.error("❌ Error fetching orders:", error);
            res.status(500).json({ error: 'Error fetching orders' });
        }
    },
    editOrderStatus: async (req, res) => {
            try {
                const { order_id } = req.params;//khai báo cái này để lấy từ link vd order/order_id
                const { order_status } = req.body;//khai báo giá trị mới sẽ được cạp nhật
    
    
                if (!order_id || !order_status) {
                    return res.status(400).json({ error: 'order_id and order_status are required' });
                }
    
                const order = await Order.findOne({ order_id });
                if (!order) {
                    return res.status(404).json({ message: 'Order_id not found' });
                }
    
                order.order_status = order_status;
                await order.save();
    
                res.status(200).json({ message: 'Order status updated successfully', order });
            } catch (error) {
                console.error("❌ Error updating order status:", error);
                res.status(500).json({ error: 'Error updating order status' });
            }
    },
    cancelOrder: async (req, res) => {
        const { order_id } = req.params;
        console.log(`📩 Nhận yêu cầu huỷ đơn hàng với order_id: ${order_id}`);

        try {
            const order = await Order.findOne({ order_id });
            if (!order) {
                console.log("❌ Không tìm thấy đơn hàng");
                return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
            }

            console.log(`🔍 Tìm thấy đơn hàng: ${order.order_id}, trạng thái: ${order.order_status}`);

            // Nếu đã giao thì không được huỷ
            if (order.order_status === "shipped") {
                console.log("⚠️ Đơn hàng đang được giao, không thể huỷ");
                return res.status(400).json({ error: 'Đơn hàng đang giao không thể huỷ' });
            }

            // ✅ Trả số lượng về kho
            for (const item of order.cartItems) {
                console.log(`🔄 Hoàn lại ${item.quantity} sản phẩm ID: ${item.product_id}`);
                const product = await Product.findOne({ product_id: item.product_id });
                if (product) {
                    product.quantity += item.quantity;
                    await product.save();
                    console.log(`✅ Đã cập nhật số lượng sản phẩm: ${product.product_id} => ${product.quantity}`);
                } else {
                    console.log(`⚠️ Không tìm thấy sản phẩm: ${item.product_id}`);
                }
            }

            // ✅ Cập nhật trạng thái đơn hàng
            order.order_status = "cancelled";
            await order.save();
            console.log(`✅ Đơn hàng ${order.order_id} đã được huỷ thành công`);

            res.status(200).json({ message: "Đã huỷ đơn hàng và hoàn kho", order });
        } catch (error) {
            console.error("❌ Lỗi server khi huỷ đơn:", error);
            res.status(500).json({ error: "Lỗi server khi huỷ đơn hàng" });
        }
    },
    getOrderSuccess: async (req, res) => {
        const { uid } = req.user;
        if(!uid){
            return res.status(400).json({error: "UID is required"});
        }
        
        try{
            const order_success = await Order.find({ uid , order_status: "success" });
            res.status(200).json(order_success);
        }     
        catch(error){
            res.status(500).json({error: 'Error'})
        }
    },
   getOrderDeliverry: async (req, res) => {
        const { uid } = req.user;
        if(!uid){
            return res.status(400).json({error: "UID is required"});
        }
        
        try{
            const order_success = await Order.find({ uid , order_status: "delivered" });
            res.status(200).json(order_success);
        }     
        catch(error){
            res.status(500).json({error: 'Error'})
        }
    },
   getOrderCancel: async (req, res) => {
        const { uid } = req.user;
        if(!uid){
            return res.status(400).json({error: "UID is required"});
        }
        
        try{
            const order_success = await Order.find({ uid , order_status: "cancelled" });
            res.status(200).json(order_success);
        }     
        catch(error){
            res.status(500).json({error: 'Error'})
        }
    },
   getOrderPaid: async (req, res) => {
        const { uid } = req.user;
        if(!uid){
            return res.status(400).json({error: "UID is required"});
        }
        
        try{
            const order_success = await Order.find({ uid , order_status: "paid" });
            res.status(200).json(order_success);
        }     
        catch(error){
            res.status(500).json({error: 'Error'})
        }
    },

};

module.exports = orderController;