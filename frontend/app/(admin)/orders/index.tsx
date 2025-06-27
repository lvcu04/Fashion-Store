
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from '@/context/authContext';
import { API } from '@/constants/api';

export interface CartItem {
  product_id: string;
  productName: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  receiverName: string;
}

export type PaymentMethod = "COD" | "MOMO";
export type OrderStatus = "pending" | "paid" | "delivered" | "success" | "cancelled";

export interface Order {
  _id?: string;
  order_id?: string;
  uid: string;
  order_date?: Date;
  cartItems: CartItem[];
  total_price?: number;
  shipping_address: ShippingAddress;
  payment_method?: PaymentMethod;
  order_status?: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function OrdersPage() {
  const { firebaseUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");//khai báo tìm kiếm
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);//khai báo orderId
  const [editedStatus, setEditedStatus] = useState<OrderStatus>("pending");//khai báo trạng thái
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await firebaseUser?.getIdToken();
      const res = await fetch(API.order.allOrders, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể tải đơn hàng");
      setOrders(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  console.log("Editing order:", );


  const editOrderStatus = async (newStatus: OrderStatus) => {
  if (!editingOrderId) return; // Kiểm tra nếu chưa có ID

  try {
    const token = await firebaseUser?.getIdToken();
    const res = await fetch(API.order.editOrderStatus(editingOrderId), {//do bên api có trường order_id r nên ta dùng editingOrderId để thay thế 
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order_status: newStatus }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");

    setEditingOrderId(null); // reset lại state để khi chỉnh sửa xong ko còn ở trang chỉnh sửa nữa
    fetchOrders(); // làm mới danh sách
  } catch (err) {
    console.error("Edit status error:", err);
  }
};

  if(editingOrderId){
    console.log("order_id của:", editingOrderId);
  }else{
    console.log("No order_id ");
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.shipping_address?.receiverName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
            <Text className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</Text>
          </View>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Tìm theo tên khách hàng..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : (
          <ScrollView className="px-4 py-2" showsVerticalScrollIndicator={false}>
            {filteredOrders.map((order) => (
              <View
                key={order._id}
                className="bg-white rounded-2xl p-4 mb-4 shadow-md border border-gray-100"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                      <MaterialIcons name="shopping-cart" size={22} color="#4F46E5" />
                    </View>
                    <View>
                      <Text className="font-semibold text-base text-gray-900">
                        {order.order_id
                          ? `${order.order_id.slice(0, 6)}...${order.order_id.slice(-4)}`//rún gọn lại order_id nếu quá dài
                          : "Không có mã đơn"}
                      </Text>
                      <Text className="text-gray-400 text-xs">
                        {order.order_date
                          ? new Date(order.order_date).toLocaleDateString("vi-VN")
                          : ""}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center space-x-2">
                    {editingOrderId === order.order_id ? (//nếu order_id là editingOrderId mà === order_id trong trang index  thì hiển thị chỉnh sửa
                        console.log("order_id", order.order_id),
                      console.log("editedStatus", editedStatus),
                      <>
                        <Picker
                          selectedValue={editedStatus}
                          onValueChange={(value) => setEditedStatus(value)}
                          style={{ height: 40, width: 140 }}
                        >
                          <Picker.Item label="pending" value="pending" />
                          <Picker.Item label="paid" value="paid" />
                          <Picker.Item label="delivered" value="delivered" />
                          <Picker.Item label="success" value="success" />
                          <Picker.Item label="cancelled" value="cancelled" />
                        </Picker>
                        <TouchableOpacity
                          onPress={() => editOrderStatus(editedStatus)}
                          className="bg-green-500 px-3 py-1 rounded-full"
                        >
                          <Text className="text-white text-xs font-semibold">Lưu</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <View
                          className={`px-3 py-1 rounded-full ${
                            order.order_status === "success"
                              ? "bg-green-100"
                              : order.order_status === "pending"
                              ? "bg-yellow-100"
                              : order.order_status === "cancelled"
                              ? "bg-red-100"
                              : "bg-blue-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              order.order_status === "success"
                                ? "text-green-600"
                                : order.order_status === "pending"
                                ? "text-yellow-600"
                                : order.order_status === "cancelled"
                                ? "text-red-600"
                                : "text-blue-600"
                            }`}
                          >
                            {order.order_status}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            setEditingOrderId(order.order_id || null);
                            setEditedStatus(order.order_status || "pending");
                          }}
                        >
                          <Text className="text-blue-500 text-xs ml-2">Chỉnh sửa</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>

                <View className="flex-row justify-between items-end mt-2">
                  <View>
                    <Text className="text-gray-600 text-sm">
                      Khách: {order.shipping_address.receiverName}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      Sản phẩm: {order.cartItems.length}
                    </Text>
                  </View>
                  <Text className="text-blue-500 font-bold text-lg" numberOfLines={1}>
                    {order.total_price?.toLocaleString()}₫
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}


