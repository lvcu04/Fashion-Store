import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
const fakeOrders = [
  {
    id: "OD001",
    customer: "Nguyễn Văn A",
    total: 500000,
    status: "completed",
    date: "2024-03-15",
    items: 3,
  },
  {
    id: "OD002",
    customer: "Trần Thị B",
    total: 780000,
    status: "pending",
    date: "2024-03-14",
    items: 2,
  },
  {
    id: "OD003",
    customer: "Lê Văn C",
    total: 1200000,
    status: "processing",
    date: "2024-03-13",
    items: 4,
  },
];

export default function OrdersPage() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-6 pb-2 rounded-b-3xl shadow-md">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="#4B5563" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800">
              Quản lý đơn hàng
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(admin)/orders")}
            className="bg-blue-500 px-4 py-2 rounded-full shadow"
          >
            <Text className="text-white font-semibold">+ Tạo đơn mới</Text>
          </TouchableOpacity>
        </View>
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-1">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Tìm kiếm đơn hàng..."
          />
        </View>
      </View>

      {/* Orders List */}
      <ScrollView className="flex-1 px-4">
        {fakeOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            onPress={() => router.push("/(admin)/orders")}
            className="bg-white rounded-2xl p-4 mb-4 shadow-md border border-gray-100"
            activeOpacity={0.85}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                  <MaterialIcons
                    name="shopping-cart"
                    size={22}
                    color="#4F46E5"
                  />
                </View>
                <View>
                  <Text className="font-semibold text-base text-gray-900">
                    {order.id}
                  </Text>
                  <Text className="text-gray-400 text-xs">{order.date}</Text>
                </View>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  order.status === "completed"
                    ? "bg-green-100"
                    : order.status === "pending"
                    ? "bg-yellow-100"
                    : "bg-blue-100"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    order.status === "completed"
                      ? "text-green-600"
                      : order.status === "pending"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {order.status === "completed"
                    ? "Hoàn thành"
                    : order.status === "pending"
                    ? "Đang chờ"
                    : "Đang xử lý"}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-end mt-2">
              <View>
                <Text className="text-gray-600 text-sm">
                  Khách: {order.customer}
                </Text>
                <Text className="text-gray-400 text-xs">
                  Sản phẩm: {order.items}
                </Text>
              </View>
              <Text className="text-blue-500 font-bold text-lg">
                {order.total.toLocaleString()}₫
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}