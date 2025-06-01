import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

type OrderItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size: string | number;
  color: string;
  image: string;
  orderDate: string;
  orderId: string;
  status: string;
};

const MyOrder = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Ongoing" | "Completed">(
    "Ongoing"
  );
  const [orders, setOrders] = useState<{
    Ongoing: OrderItem[];
    Completed: OrderItem[];
  }>({
    Ongoing: [
      {
        id: "1",
        title: "Soludos Ibiza Classic Lace Sneakers",
        price: 120.0,
        quantity: 1,
        size: 42,
        color: "#d1d5db",
        image: "https://via.placeholder.com/150/FF6F61/FFFFFF?text=Sneakers",
        orderDate: "May 15, 2025",
        orderId: "ORD12345",
        status: "Processing",
      },
      {
        id: "2",
        title: "Beats Solo3 Wireless Kulak",
        price: 50.0,
        quantity: 1,
        size: "M",
        color: "#000000",
        image: "https://via.placeholder.com/150/4A90E2/FFFFFF?text=Headphone",
        orderDate: "May 14, 2025",
        orderId: "ORD12346",
        status: "Shipped",
      },
    ],
    Completed: [
      {
        id: "3",
        title: "Leather Crossbody Bag",
        price: 89.5,
        quantity: 1,
        size: "One Size",
        color: "#50C878",
        image: "https://via.placeholder.com/150/50C878/FFFFFF?text=Bag",
        orderDate: "May 10, 2025",
        orderId: "ORD12347",
        status: "Delivered",
      },
    ],
  });

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 150,
            easing: Easing.ease,
          }),
        },
      ],
      opacity: withTiming(opacity.value, {
        duration: 150,
        easing: Easing.ease,
      }),
    };
  });

  const handlePressIn = () => {
    scale.value = 0.96;
    opacity.value = 0.8;
  };

  const handlePressOut = () => {
    scale.value = 1;
    opacity.value = 1;
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.image }}
          style={{ width: 80, height: 80 }}
          className="rounded-xl"
          resizeMode="contain"
        />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {item.title}
          </Text>
          <View className="flex-row mt-1">
            <Text className="text-sm text-gray-600">
              Quantity: {item.quantity}
            </Text>
            <Text className="text-sm text-gray-600 ml-4">
              Size: {item.size}
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Text className="text-sm text-gray-600">Color: </Text>
            <View
              style={{ backgroundColor: item.color }}
              className="w-5 h-5 rounded-full border border-gray-300"
            />
          </View>
          <Text className="text-xl font-bold text-gray-800 mt-2">
            ${item.price.toFixed(2)}
          </Text>
        </View>
      </View>
      <View className="border-t border-gray-200 mt-4 pt-3">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-sm text-gray-500">
              Order Date: {item.orderDate}
            </Text>
            <Text className="text-sm text-gray-500">
              Order ID: {item.orderId}
            </Text>
          </View>
          <Text
            className={`text-sm font-semibold ${
              item.status === "Delivered" ? "text-green-600" : "text-orange-500"
            }`}
          >
            {item.status}
          </Text>
        </View>
        <Animated.View style={animatedStyle} className="mt-3">
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="bg-gray-900 rounded-full py-2 px-4 flex-row items-center justify-center"
          >
            <AntDesign name="eye" size={16} color="white" />
            <Text className="text-white font-semibold ml-2">
              {activeTab === "Ongoing" ? "Track Order" : "View Details"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white pt-12 pb-4 px-5 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-black ml-4">My Orders</Text>
      </View>
      <View className="bg-white px-5 pb-5">
        <View className="flex-row mt-5">
          <TouchableOpacity
            onPress={() => setActiveTab("Ongoing")}
            className={`flex-1 py-3 rounded-full mr-3 ${
              activeTab === "Ongoing" ? "bg-gray-900" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "Ongoing" ? "text-white" : "text-gray-700"
              }`}
            >
              Ongoing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("Completed")}
            className={`flex-1 py-3 rounded-full ${
              activeTab === "Completed" ? "bg-gray-900" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "Completed" ? "text-white" : "text-gray-700"
              }`}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {orders[activeTab].length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <AntDesign name="shoppingcart" size={50} color="#d1d5db" />
          <Text className="text-xl font-semibold text-gray-500 mt-4">
            No {activeTab} Orders
          </Text>
          <Text className="text-sm text-gray-400 mt-2">
            Start shopping to see your orders here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders[activeTab]}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MyOrder;
