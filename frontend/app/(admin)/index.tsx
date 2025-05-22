import { useAuth } from "@/context/authContext";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

// Define allowed routes type
type AdminRoute =
  | "/(admin)/products"
  | "/(admin)/orders"
  | "/(admin)/users"
  | "/(admin)/revenue"
  | "/(admin)/products/addProducts";

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    products: 156,
    orders: 45,
    users: 89,
    revenue: 12000,
  });

  const menuItems = [
    {
      id: "products",
      title: "Sản phẩm",
      icon: "shirt",
      count: summary.products,
      color: "#4F46E5",
      route: "/(admin)/products" as AdminRoute,
    },
    {
      id: "orders",
      title: "Đơn hàng",
      icon: "cart",
      count: summary.orders,
      color: "#10B981",
      route: "/(admin)/orders" as AdminRoute,
    },
    {
      id: "users",
      title: "Người dùng",
      icon: "users",
      count: summary.users,
      color: "#F59E0B",
      route: "/(admin)/users" as AdminRoute,
    },
    {
      id: "revenue",
      title: "Doanh thu",
      icon: "chart-line",
      count: summary.revenue.toLocaleString() + "₫",
      color: "#EF4444",
      route: "/(admin)/revenue" as AdminRoute,
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{ uri: user?.photoURL || "https://i.pravatar.cc/100" }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                Xin chào, {user?.displayName || "Admin"}!
              </Text>
              <Text className="text-gray-500">Chào mừng trở lại</Text>
            </View>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-2">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#4B5563"
              />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-100">
              <Ionicons name="settings-outline" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Quick Stats */}
        <View className="flex-row flex-wrap justify-between mt-4">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route as any)}
              className="w-[48%] bg-white rounded-xl p-4 mb-4 shadow-sm"
            >
              <View className="flex-row items-center justify-between">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: item.color + "20" }}
                >
                  <FontAwesome5 name={item.icon} size={20} color={item.color} />
                </View>
                <Text
                  className="text-2xl font-bold"
                  style={{ color: item.color }}
                >
                  {item.count}
                </Text>
              </View>
              <Text className="text-gray-600 mt-2">{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Orders */}
        <View className="mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Đơn hàng gần đây
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(admin)/orders" as any)}
            >
              <Text className="text-blue-500">Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm">
            {[1, 2, 3].map((order) => (
              <View
                key={order}
                className="flex-row items-center py-3 border-b border-gray-100"
              >
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                  <MaterialIcons
                    name="shopping-cart"
                    size={20}
                    color="#4B5563"
                  />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-semibold">Đơn hàng #{order}</Text>
                  <Text className="text-gray-500">2 sản phẩm • 1,500,000₫</Text>
                </View>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-600 text-sm">Hoàn thành</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mt-6 mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Thao tác nhanh
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              onPress={() =>
                router.push("/(admin)/products/addProducts" as any)
              }
              className="w-[48%] bg-white rounded-xl p-4 mb-4 shadow-sm items-center"
            >
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
                <Ionicons name="add-circle-outline" size={24} color="#4F46E5" />
              </View>
              <Text className="text-gray-800 font-medium">Thêm sản phẩm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(admin)/orders" as any)}
              className="w-[48%] bg-white rounded-xl p-4 mb-4 shadow-sm items-center"
            >
              <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-2">
                <Ionicons name="create-outline" size={24} color="#10B981" />
              </View>
              <Text className="text-gray-800 font-medium">Tạo đơn hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
