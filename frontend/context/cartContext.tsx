import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { API } from "@/constants/api";
import { useAuth } from "@/context/authContext";
import { Alert } from "react-native";

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
  cartItems: CartItem[];//khai báo thêm cart cục bộ
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  fetchCartItems: () => Promise<void>;//Từ hàm này đến các hàm dưới được chuyển từ cart.tsx qua
  fetchQuanlityProduct: (id: string) => Promise<number>;
  updateQuantityCartItem: (id: string, delta: number) => void;
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
  const { firebaseUser } = useAuth();
  //CartItem
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);//khai báo thêm cart cục bộ
  const [stockMap, setStockMap] = useState<Record<string, number>>({});//khai báo stock product

  
  
  // Cập nhật sản phẩm trong giỏ hàng lên server
  const updateCart = async (item: CartItem) => {
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
    const existingItem = cart.find((i) => i.product_id === item.product_id);

  const updatedItem: CartItem = existingItem
    ? { ...item, quantity: existingItem.quantity + item.quantity }
    : item;

  updateCart(updatedItem);

  // Cập nhật local cartItems nếu cần thiết
  setCartItems((prev) => {
    const index = prev.findIndex((i) => i.product_id === item.product_id);
    if (index !== -1) {
      const updated = [...prev];
      updated[index].quantity += item.quantity;
      return updated;
    } else {
      return [...prev, item];
    }
  });
  };

  // Cập nhật số lượng hoặc xóa nếu quantity = 0
  const updateQuantity = (product_id: string, quantity: number) => {
    const item = cart.find((i) => i.product_id === product_id);
    if (item) {
      updateCart({ ...item, quantity });
    }
  };

  //CART LOCAL
  // Gọi API lấy giỏ hàng local
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

    // Tạo bản sao cartItems hiện tại (local), ... để liệt kê sp có trong cartItems
    const mergedItems = [...cartItems];

    // Gộp serverItems vào mergedItems mà không làm mất local update
    for (const serverItem of serverItems) {
      const existingIndex = mergedItems.findIndex(//tìm vị trí sp trong local cart xem cố trùng product_id với sp trong cart server ko
        (item) => item.product_id === serverItem.product_id
      );

      if (existingIndex !== -1) {
        // Nếu sản phẩm đã có local, giữ lại local cart (không ghi đè server)
        continue;
      } else {
        // Nếu là sản phẩm mới từ server, thêm vào cart cục bộ
        mergedItems.push(serverItem);
      }
    }

    setCartItems(mergedItems);
  } catch (err) {
    console.error("Error fetching cart:", err);
    Alert.alert("Error", "Không tải được giỏ hàng");
  } finally {
    setLoading(false);
  }
};



    
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
      console.error("Lỗi khi lấy tồn kho:", err);
      return 0;
    }
  };
   // Cập nhật số lượng sản phẩm trong cart (local)
 const updateQuantityCartItem = (id: string, delta: number) => {
  const stock = stockMap[id] ?? 0;
  setCartItems((prev) =>
    prev.map((item) => {
      if (item.product_id !== id) return item;

      const newQuantity = item.quantity + delta;
      if (newQuantity < 1) return { ...item, quantity: 1 };
      if (newQuantity > stock) {
        Alert.alert("Error", "Quantity passed in stock.");
        return item;
      }
      return { ...item, quantity: newQuantity };
    })
  );
  console.log("Cart items after update:", cartItems);
  
};
const loadAllStocks = async (items: CartItem[]) => {
  const missingStocks = items.filter(
    (item) => stockMap[item.product_id] === undefined
  );
  for (const item of missingStocks) {
    const stock = await fetchQuanlityProduct(item.product_id);
    setStockMap((prev) => ({ ...prev, [item.product_id]: stock }));
  }
};

//tạo hàm remove sp cart cục bộ riêng
const removeCartItemLocal = (product_id: string) => {
  setCartItems((prevItems) =>
    prevItems.filter((item) => item.product_id !== product_id)
  );
};

// Xoá sản phẩm (gọi API)
 const removeCartItem = async (product_id: string) => {
  Alert.alert(
    "Confirm deletion",
    "Are you sure you want to delete the product?",
    [
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
            //nếu phản hồi từ server xóa ok, thì xóa lun khỏi cục bộ
            if (res.ok) {
              removeCartItemLocal(product_id); // Xoá khỏi local UI
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
    ]
  );
};


//hàm tính tổng
const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Xóa sạch giỏ hàng ở frontend (chỉ frontend)
  const clearCart = () => {
    setCart([]);
  };

  // Khi đăng nhập → fetch lại giỏ hàng
  useEffect(() => {
    setCart([]); // Reset giỏ hàng khi đăng nhập
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems, //add thêm các hàm đã khai báo ở trên type nếu sử dụng
        addToCart,
        updateQuantity,
        clearCart,
        fetchCartItems,
        fetchQuanlityProduct,
        updateQuantityCartItem,
        loadAllStocks,
        removeCartItem,
        totalPrice,
        stockMap
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
