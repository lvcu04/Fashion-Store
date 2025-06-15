const express = require('express');
const CartController = require('../controllers/CartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Lấy giỏ hàng theo UID (người dùng)
router.get('/', authMiddleware.VerifyToken, CartController.getCartByUser); // GET http://localhost:5000/api/cart/

// ✅ Thêm/sửa sản phẩm vào giỏ hàng
router.post('/addCart', authMiddleware.VerifyToken, CartController.addToCart); // POST http://localhost:5000/api/cart/addCart
router.put('/updateCart', authMiddleware.VerifyToken, CartController.updateCartItem); // PUT http://localhost:5000/api/cart/updateCart
// ✅ Thanh toán giỏ hàng
// router.post('/', authMiddleware.VerifyToken, CartController.updateCartItemQuantity);

// ✅ Xoá 1 sản phẩm khỏi giỏ hàng
router.delete('/remove/:product_id', authMiddleware.VerifyToken, CartController.removeFromCart); // DELETE http://localhost:5000/api/cart/remove/pi4

// ✅ Xoá toàn bộ giỏ hàng (tuỳ chọn, nếu muốn dùng)
router.delete('/removeAll', authMiddleware.VerifyToken, async (req, res) => {
    const { uid } = req.user;
    try {
        const cart = await require("../models/Cart").findOne({ uid });
        if (!cart) return res.status(404).json({ error: "Không tìm thấy giỏ hàng" });

        const { Product } = require("../models/Product");
        for (const item of cart.items) {
            const product = await Product.findOne({ product_id: item.product_id });
            if (product) {
                product.quantity += item.quantity;
                await product.save();
            }
        }

        cart.items = [];
        await cart.save();
        res.status(200).json({ message: "Đã xoá toàn bộ giỏ hàng", cart });
    } catch (error) {
        console.error("❌ Lỗi khi xoá toàn bộ giỏ hàng:", error);
        res.status(500).json({ error: "Không thể xoá toàn bộ giỏ hàng" });
    }
});

module.exports = router;