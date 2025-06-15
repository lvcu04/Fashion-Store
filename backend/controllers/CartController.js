const Cart = require("../models/Cart");
const { Product } = require("../models/Product");

const CartController = {
  // 1. Lấy giỏ hàng theo user
   getCartByUser: async (req, res) => {
        const { uid } = req.user;
        
        if(!uid) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        try {
        // console.log("UID nhận được:", uid);
        const cart = await Cart.findOne({ uid });
        // console.log("Cart tìm được:", cart);
        res.status(200).json(cart || { uid, items: [] });
    } catch (error) {
        console.error("Lỗi khi getCart:", error);
        res.status(500).json({ error: "Lỗi server khi lấy giỏ hàng" });
    }
},
  // 2. Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem: async (req, res) => {
  const { uid } = req.user;
  const { product_id, quantity } = req.body;

  console.log("👉 [updateCartItem] Request body:", req.body);

  if (!product_id || typeof quantity !== "number") {
    console.warn("⚠️ Thiếu hoặc sai dữ liệu đầu vào");
    return res.status(400).json({ error: "Thiếu hoặc sai dữ liệu đầu vào" });
  }

  try {
    const product = await Product.findOne({ product_id });
    if (!product) {
      console.warn("❌ Sản phẩm không tồn tại:", product_id);
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    if (quantity > product.stock) {
      console.warn(`❌ Vượt quá tồn kho: yêu cầu ${quantity}, kho còn ${product.stock}`);
      return res.status(400).json({ error: "Vượt quá số lượng tồn kho" });
    }

    const cart = await Cart.findOne({ uid });
    if (!cart) {
      console.warn("❌ Không tìm thấy giỏ hàng cho uid:", uid);
      return res.status(404).json({ error: "Không tìm thấy giỏ hàng" });
    }

    const item = cart.items.find(i => i.product_id === product_id);
    if (!item) {
      console.warn("❌ Sản phẩm không có trong giỏ:", product_id);
      return res.status(404).json({ error: "Sản phẩm không có trong giỏ" });
    }

    if (quantity > 0) {
      console.log(`✅ Cập nhật sản phẩm ${product_id} số lượng từ ${item.quantity} → ${quantity}`);
      item.quantity = quantity;
    } else {
      console.log(`🗑️ Xoá sản phẩm ${product_id} khỏi giỏ`);
      cart.items = cart.items.filter(i => i.product_id !== product_id);
    }

    await cart.save();
    console.log("✅ Giỏ hàng sau cập nhật:", cart.items);

    return res.status(200).json({ message: "Cập nhật giỏ hàng thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật giỏ hàng:", err);
    return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật giỏ hàng" });
  }
},




  // 3. Thêm sản phẩm vào giỏ hàng
  addToCart: async (req, res) => {
  const { uid } = req.user;
  let items = [];

  console.log("👉 addToCart Request body:", req.body);

  if (Array.isArray(req.body.items)) {
    items = req.body.items;
  } else if (req.body.product_id) {
    const { product_id, productName, image, price, quantity } = req.body;
    items = [{ product_id, productName, image, price, quantity }];
  } else {
    console.warn("⚠️ Thiếu dữ liệu sản phẩm");
    return res.status(400).json({ error: "Thiếu dữ liệu sản phẩm" });
  }

  try {
    let cart = await Cart.findOne({ uid });
    if (!cart) {
      console.log("🛒 Chưa có giỏ hàng, tạo mới cho uid:", uid);
      cart = new Cart({ uid, items: [] });
    }

    for (const newItem of items) {
      const { product_id, productName, image, price, quantity } = newItem;
      if (!product_id || quantity <= 0) {
        console.warn("⚠️ Bỏ qua sản phẩm không hợp lệ:", newItem);
        continue;
      }

      const existing = cart.items.find(i => i.product_id === product_id);
      if (existing) {
        console.log(`🔁 Tăng số lượng sản phẩm ${product_id} từ ${existing.quantity} → ${existing.quantity + quantity}`);
        existing.quantity += quantity;
      } else {
        console.log(`🆕 Thêm sản phẩm mới vào giỏ:`, newItem);
        cart.items.push({ product_id, productName, image, price, quantity });
      }
    }

    await cart.save();
    console.log("✅ Giỏ hàng sau khi thêm:", cart.items);

    res.status(200).json({ items: cart.items });
  } catch (err) {
    console.error("❌ Lỗi khi thêm vào giỏ:", err);
    res.status(500).json({ error: "Không thể thêm sản phẩm" });
  }
},





  // 4. Xoá một sản phẩm khỏi giỏ
  removeFromCart: async (req, res) => {
    const { uid } = req.user; // uid được lấy từ token (middleware)
    const { product_id } = req.params;

    try {
      const cart = await Cart.findOne({ uid });
      if (!cart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }

      const exists = cart.items.some((i) => i.product_id === product_id);
      if (!exists) {
        return res.status(404).json({ message: "Sản phẩm không có trong giỏ" });
      }

      // Xoá sản phẩm khỏi mảng items
      cart.items = cart.items.filter((i) => i.product_id !== product_id);

      await cart.save();
      return res.status(200).json({ message: "Đã xoá sản phẩm", cart });
    } catch (err) {
      console.error("Lỗi delete:", err);
      return res.status(500).json({ error: "Không thể xoá sản phẩm" });
    }
  },
 
};

module.exports = CartController;