import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { API } from "@/constants/api";
import { useAuth } from "@/context/authContext";

// Kiểu dữ liệu cho item trong giỏ hàng
type CartItem = {
  product_id: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
};

// Kiểu dữ liệu context giỏ hàng
type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

// Tạo context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { firebaseUser } = useAuth();

  // Cập nhật sản phẩm trong giỏ hàng lên server
  const updateCartItem = async (item: CartItem) => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(API.cart.addToCart, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              product_id: item.product_id,
              productName: item.productName,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
            },
          ],
        }),

      });

      if (!res.ok) throw new Error("Cập nhật giỏ hàng thất bại");

      const data = await res.json();
      const updatedCart: CartItem[] =
        data.items?.map((i: any) => ({
          product_id: i.product_id,
          productName: i.productName,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
        })) || [];

      setCart(updatedCart);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật giỏ hàng:", err);
    }
  };

  // Thêm hoặc cập nhật sản phẩm
  const addToCart = (item: CartItem) => {
    updateCartItem(item);
  };

  // Cập nhật số lượng hoặc xóa nếu quantity = 0
  const updateQuantity = (product_id: string, quantity: number) => {
    const item = cart.find((i) => i.product_id === product_id);
    if (item) {
      updateCartItem({ ...item, quantity });
    }
  };

  // Xóa sạch giỏ hàng ở frontend (chỉ frontend)
  const clearCart = () => {
    setCart([]);
  };

  // Khi đăng nhập → fetch lại giỏ hàng
  useEffect(() => {
    setCart([]); // Reset giỏ hàng khi đăng nhập
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
