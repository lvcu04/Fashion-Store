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
import { useCart } from "@/context/cartContext";


type CartItem = {
  product_id: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
};

const MyCart = () => {
  const router = useRouter();
  const {
    cart: cartItems, // dùng trực tiếp từ server
    fetchCartItems,
    removeCartItem,
    updateQuantity,
    totalPrice,
    stockMap,
    loadAllStocks,
  } = useCart();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    loadAllStocks(cartItems);
  }, [cartItems]);

  const updateQuantityCartItem = async (id: string, delta: number) => {
    const item = cartItems.find((i) => i.product_id === id);
    if (!item) return;

    const stock = stockMap[id] ?? 0;
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) return;
    if (newQuantity > stock) {
      Alert.alert("Lỗi", "Số lượng vượt quá tồn kho");
      return;
    }

    updateQuantity(id, newQuantity);
  };

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
              onPress={() => updateQuantityCartItem(item.product_id, -1)}
              className="bg-gray-200 rounded-full p-1"
            >
              <AntDesign name="minus" size={16} color="#374151" />
            </TouchableOpacity>
            <Text className="mx-3 text-lg text-gray-800">{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantityCartItem(item.product_id, 1)}
              className="bg-gray-200 rounded-full p-1"
            >
              <AntDesign name="plus" size={16} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => removeCartItem(item.product_id)} className="ml-2">
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
  const cartIsEmpty = !cartItems || cartItems.length === 0;

  
if (cartIsEmpty) {
  console.log("cartItems rỗng hoặc không tồn tại", cartItems);
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
        console.log("đọ dai cart", cartItems.length),
        <View className="flex-1 items-center justify-center">
          <AntDesign name="shoppingcart" size={50} color="#d1d5db" />
          <Text className="text-lg font-semibold text-gray-500 mt-4">
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
              onPress={() => router.push("/(checkout)/checkout" as any)}
              className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center"
            >
              <Text className="text-white font-semibold text-lg">
                Process to checkout
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
