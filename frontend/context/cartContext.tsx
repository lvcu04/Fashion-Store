import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Alert } from "react-native";
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
  fetchCartItems: () => Promise<void>;
  fetchQuanlityProduct: (id: string) => Promise<number>;
  loadAllStocks: (items: CartItem[]) => Promise<void>;
  removeCartItem: (id: string) => Promise<void>;
  totalPrice: number;
  stockMap: { [key: string]: number };
};

// Tạo context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const { firebaseUser } = useAuth();


  // Cập nhật số lượng
  const updateQuantity = async (product_id: string, quantity: number) => {
    // 1. Cập nhật UI trước (ngay lập tức)
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === product_id ? { ...item, quantity } : item
      )
    );

    // 2. Đồng bộ server sau
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(API.cart.update, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id,
          quantity,
        }),
      });

      if (!res.ok) throw new Error("Cập nhật giỏ hàng thất bại");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật giỏ hàng:", err);
      Alert.alert("Lỗi", "Không thể cập nhật sản phẩm.");
    }
  };
  
   // Thêm hoặc cập nhật sản phẩm
  const addToCart = async (item: CartItem) => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(API.cart.addToCart, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [item],
        }),
      });

      if (!res.ok) throw new Error("Thêm vào giỏ thất bại");

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
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
    }
  };


  // Xoá sản phẩm khỏi giỏ
  const removeCartItem = async (product_id: string) => {
    Alert.alert("Comfirm deletion", "Are you sure you want to delete this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            const token = await firebaseUser?.getIdToken();
            const res = await fetch(API.cart.removeFromCart(product_id), {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (res.ok) {
              await fetchCartItems(); // Cập nhật lại sau khi xoá
            } else {
              const errText = await res.text();
              console.error("Xoá thất bại:", errText);
              Alert.alert("Lỗi", "Không thể xoá sản phẩm.");
            }
          } catch (err) {
            console.error("Lỗi xoá:", err);
            Alert.alert("Lỗi", "Đã có lỗi khi xoá sản phẩm.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // Lấy giỏ hàng từ server
  const fetchCartItems = async () => {
  setLoading(true);
  try {
    const token = await firebaseUser?.getIdToken();
    const res = await fetch(API.cart.getCartByUser, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    const serverItems = Array.isArray(data.items) ? data.items : [];
    const mapped = serverItems.map((i: any) => ({
      product_id: i.product_id,
      productName: i.productName,
      image: i.image,
      price: i.price,
      quantity: i.quantity,
    }));
    setCart(mapped);
  } catch (err) {
    console.error("❌ Lỗi tải giỏ hàng:", err);
    Alert.alert("Lỗi", "Không tải được giỏ hàng.");
  } finally {
    setLoading(false);
  }
};


  // Lấy tồn kho sản phẩm
  const fetchQuanlityProduct = async (productId: string): Promise<number> => {
    try {
      const token = await firebaseUser?.getIdToken();
      const res = await fetch(API.product.getById(productId), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data.quantity || 0;
    } catch (err) {
      console.error("❌ Lỗi lấy tồn kho:", err);
      return 0;
    }
  };

  // Load tồn kho cho nhiều sản phẩm
  const loadAllStocks = async (items: CartItem[]) => {
    const missing = items.filter((i) => stockMap[i.product_id] === undefined);
    for (const item of missing) {
      const stock = await fetchQuanlityProduct(item.product_id);
      setStockMap((prev) => ({ ...prev, [item.product_id]: stock }));
    }
  };

  // Tổng giá trị
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Xoá toàn bộ cart (ở frontend)
  const clearCart = () => {
    setCart([]);
  };

  // Khi đăng nhập thì reset giỏ hàng
  useEffect(() => {
    setCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        clearCart,
        fetchCartItems,
        fetchQuanlityProduct,
        loadAllStocks,
        removeCartItem,
        totalPrice,
        stockMap,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook dùng context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart phải được sử dụng trong CartProvider");
  return context;
};
