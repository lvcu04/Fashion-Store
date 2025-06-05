import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { API } from "@/constants/api";
import { useAuth } from "@/context/authContext";


type CartItem = {
  product_id: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
};

const MyCart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const { firebaseUser } = useAuth();
  // Gọi API lấy giỏ hàng
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const token = await firebaseUser?.getIdToken();
      const res = await fetch(API.cart.getCartByUser,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("Cart API Response:", data.items);
      setCartItems(Array.isArray(data.items) ? data.items : []);
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


  useEffect(() => {
    fetchCartItems();
  }, []);

  // Cập nhật số lượng sản phẩm trong cart (local)
 const updateQuantity = (id: string, delta: number) => {
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
};


  

  // Xử lý thanh toán (gửi toàn bộ giỏ lên backend 1 lần)
  // const handleToCheckout = async () => {
  //   if (cartItems.length === 0) {
  //     Alert.alert("Giỏ hàng trống", "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const token = await firebaseUser?.getIdToken();
  //     const res = await fetch(API.cart.update, {
  //       method: "PUT",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ items: cartItems }),
  //     });

  //     if (!res.ok) {
  //       const errText = await res.text();
  //       console.error("Thanh toán thất bại:", errText);
  //       Alert.alert("Lỗi", "Không thể thanh toán giỏ hàng.");
  //       return;
  //     }

  //     const data = await res.json();
  //     console.log("Thanh toán thành công:", data);
  //     Alert.alert("Thành công", "Đặt hàng thành công!");
  //     setCartItems([]); // Xoá giỏ hàng sau khi thanh toán
  //   } catch (err) {
  //     console.error("Lỗi thanh toán:", err);
  //     Alert.alert("Lỗi", "Đã có lỗi xảy ra khi thanh toán.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Xoá sản phẩm (gọi API)
  const removeItem = async (product_id: string) => {
  Alert.alert(
    "Confirm deletion",
    "Are you sure you want to delete the product?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          console.log("Xoá sản phẩm:", product_id);
          try {
            setLoading(true);
            const token = await firebaseUser?.getIdToken();
            const res = await fetch(API.cart.removeFromCart(product_id), {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("Xoá sản phẩm:", product_id, "Response:", res.status);
            if (res.ok) {
              fetchCartItems(); // Làm mới giỏ hàng
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


   

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

// Load stock for all cart items when cartItems change
useEffect(() => {
  const loadAllStocks = async () => {
    const missingStocks = cartItems.filter(
      (item) => stockMap[item.product_id] === undefined
    );
    for (const item of missingStocks) {
      const stock = await fetchQuanlityProduct(item.product_id);
      setStockMap((prev) => ({ ...prev, [item.product_id]: stock }));
    }
  };
  if (cartItems.length > 0) {
    loadAllStocks();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [cartItems]);

const renderCartItem = ({ item }: { item: CartItem }) => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg flex-row items-center">
      <Image
        source={{ uri: item.image }}
        style={{ width: 80, height: 80 }}
        className="rounded-xl"
        resizeMode="contain"
      />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-gray-900">{item.productName}</Text>
        {stockMap[item.product_id] !== undefined && (
          <Text className="text-sm text-gray-500 mt-1">
            Stock: {stockMap[item.product_id]} 
          </Text>
        )}

        <Text className="text-xl font-bold text-gray-800 mt-2">
          {(item.price * item.quantity).toLocaleString("vi-VN")}
        </Text>

        <View className="flex-row items-center mt-2">
          <TouchableOpacity
            onPress={() => updateQuantity(item.product_id, -1)}
            className="bg-gray-200 rounded-full p-1"
          >
            <AntDesign name="minus" size={16} color="#374151" />
          </TouchableOpacity>
          <Text className="mx-3 text-lg text-gray-800">{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.product_id, 1)}
            className="bg-gray-200 rounded-full p-1"
          >
            <AntDesign name="plus" size={16} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => removeItem(item.product_id)} className="ml-2">
        <AntDesign name="delete" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white pt-12 pb-4 px-5 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-black ml-4">My Cart</Text>
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <AntDesign name="shoppingcart" size={50} color="#d1d5db" />
          <Text className="text-xl font-semibold text-gray-500 mt-4">
            Your Cart is Empty
          </Text>
          <Text className="text-sm text-gray-400 mt-2">
            Start shopping to add items here!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product_id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
          />
          <View className="bg-white p-5 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg text-gray-600">
                Total ({cartItems.length} item{cartItems.length > 1 ? "s" : ""}):
              </Text>
              <Text className="text-2xl font-bold text-gray-900">
                {totalPrice.toLocaleString("vi-VN")}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center"
              // onPress={handleToCheckout}
              disabled={loading}
            >
              <Text className="text-white font-semibold text-lg">
                Proceed to Checkout
              </Text>
              <AntDesign
                name="arrowright"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default MyCart;
