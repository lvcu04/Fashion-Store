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

  if (!product_id)
    return res.status(400).json({ error: "Thiếu product_id" });

  try {
    const product = await Product.findOne({product_id});
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    console.log("📦 Trước khi cập nhật giỏ:");
    console.log(`- Tên sản phẩm: ${product.name}`);
    console.log(`- Tồn kho: ${product.stock}`);

    let cart = await Cart.findOne({ uid });
    if (!cart) return res.status(404).json({ message: "Không có giỏ hàng" });

    const idx = cart.items.findIndex(i => i.product_id === product_id);
    if (idx === -1)
      return res.status(404).json({ message: "Sản phẩm không có trong giỏ" });

    const oldQty = cart.items[idx].quantity;

    if (quantity > 0) {
      cart.items[idx].quantity = quantity;
      console.log(`✅ Cập nhật số lượng trong giỏ: ${oldQty} -> ${quantity}`);
    } else {
      cart.items.splice(idx, 1);
      console.log(`🗑️ Xoá sản phẩm khỏi giỏ`);
    }

    await cart.save();
    console.log("✅ Đã cập nhật giỏ hàng.");
    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
    res.status(500).json({ error: "Không thể cập nhật giỏ hàng" });
  }
},


  // 3. Thêm sản phẩm vào giỏ hàng
  addToCart: async (req, res) => {
  const { uid } = req.user;
  let items = [];

  if (Array.isArray(req.body.items)) {
    items = req.body.items;
  } else if (req.body.product_id) {
    const { product_id, productName, image, price, quantity } = req.body;
    items = [{ product_id, productName, image, price, quantity }];
  } else {
    return res.status(400).json({ error: "Thiếu dữ liệu sản phẩm" });
  }

  try {
    let cart = await Cart.findOne({ uid });
    if (!cart) cart = new Cart({ uid, items: [] });

    for (const newItem of items) {
      const { product_id, productName, image, price, quantity } = newItem;
      if (!product_id || quantity <= 0) continue;

      const product = await Product.findOne({product_id});
      if (!product) {
        console.log(`⚠️ Sản phẩm ${product_id} không tồn tại`);
        continue;
      }

      const existing = cart.items.find(i => i.product_id === product_id);
      if (existing) {
        console.log(`🛒 Đã có trong giỏ: ${product.name}`);
        console.log(`🔢 Số lượng cũ: ${existing.quantity}`);
        existing.quantity += quantity;
        console.log(`🔢 Số lượng mới: ${existing.quantity}`);
      } else {
        cart.items.push({ product_id, productName, image, price, quantity });
        console.log(`➕ Thêm mới vào giỏ: ${productName} - SL: ${quantity}`);
      }

      console.log(`🏪 Số lượng còn trong kho: ${product.quantity}`);
    }

    await cart.save();
    console.log("✅ Giỏ hàng đã được cập nhật");
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
