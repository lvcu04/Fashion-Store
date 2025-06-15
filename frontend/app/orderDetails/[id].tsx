import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { API } from '@/constants/api';
import { useAuth } from '@/context/authContext';
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

export type PaymentMethod = 'COD' | 'MOMO';
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'success' | 'cancelled';

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
const OrderDetail = () => {
  const {id: orderId} = useLocalSearchParams<{ id: string }>();
  console.log('order_id được truyền', orderId);
  const {firebaseUser} = useAuth();
  const router = useRouter();
  const [orderData, setOrderData] = useState<Order | null>();
  const [loading, setLoading] = useState(true);
  
  const cancelOrder = async () => {
    Alert.alert("Xác nhận huỷ", "Bạn có chắc muốn huỷ đơn hàng này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Huỷ đơn",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            const token = await firebaseUser?.getIdToken();
            const res = await fetch(API.order.cancel(orderId), {
              method: "DELETE", // hoặc POST nếu bạn dùng POST
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            const result = await res.json();

            if (res.ok) {
              Alert.alert("Thành công", "Đơn hàng đã được huỷ.");
              // Gợi ý: Có thể gọi lại API để refetch đơn hàng nếu muốn cập nhật UI
              // setOrderData((prev) => {
              //   if (!prev) return prev;
              //   return {
              //     ...prev,
              //     order_status: "cancelled",
              //   };
              // });
            } else {
              console.error("❌ Huỷ thất bại:", result);
              Alert.alert("Lỗi", result?.error || "Không thể huỷ đơn hàng.");
            }
            router.push('/(tabs)/myOrder')
          } catch (err) {
            console.error("❌ Lỗi mạng khi huỷ:", err);
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi huỷ đơn hàng.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    
    const fetchOrderByOrderId = async () => {
      try {
        const token = await firebaseUser?.getIdToken();
        if (!orderId) return;
        const response = await fetch(API.order.OrderByOrderId(orderId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const orderData = await response.json();
          setOrderData(orderData);
          console.log('orderData', orderData);
        }
        
      } catch (error) {
        // handle error if needed
      }
    };
    fetchOrderByOrderId();
  }, [setOrderData]);

  return (
   <ScrollView className="flex-1 bg-white px-5 pt-1 pb-10">
    {/* Back button */}
    <TouchableOpacity onPress={() => router.back()} className="mb-4">
      <AntDesign name="arrowleft" size={24} color="#000" />
    </TouchableOpacity>

    <Text className="text-3xl font-bold text-black mb-6">Order Details</Text>

    {orderData && (
      <View className="bg-gray-50 rounded-xl p-4 shadow-md border border-gray-200 pb-6">
        {/* Danh sách sản phẩm */}
        <Text className="text-xl font-semibold text-black mb-4">Products</Text>
        {orderData.cartItems.map((item, idx) => (
          <View key={item.product_id + idx} className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden mr-3">
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 48, height: 48 }}
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-xs text-gray-400 text-center">No image</Text>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-800">{item.productName}</Text>
              <Text className="text-xs text-gray-500">
                SL: {item.quantity} x {item.price.toLocaleString()}₫
              </Text>
            </View>
          </View>
        ))}

        {/* Tổng giá tiền */}
        <View className="mt-4 border-t border-gray-200 pt-4">
          <Text className="text-lg font-bold text-black">
            Total: {orderData.total_price?.toLocaleString()}₫
          </Text>
        </View>

        {/* Thông tin giao hàng */}
        <View className="mt-6">
          <Text className="text-xl font-semibold text-black mb-2">Shipping Address</Text>
          <Text className="text-gray-700">{orderData.shipping_address.receiverName}</Text>
          <Text className="text-gray-700">{orderData.shipping_address.street}</Text>
          <Text className="text-gray-700">{orderData.shipping_address.city}</Text>
        </View>

        {/* Phương thức thanh toán */}
        <View className="mt-6">
          <Text className="text-xl font-semibold text-black mb-2">Payment Method</Text>
          <Text className="text-gray-700">{orderData.payment_method}</Text>
        </View>

        {/* Trạng thái đơn hàng */}
        <View className="mt-6">
          <Text className="text-xl font-semibold text-black mb-2">Order Status</Text>
          <Text
            className={`text-base font-bold ${
              orderData.order_status === 'success'
                ? 'text-green-600'
                : orderData.order_status === 'cancelled'
                ? 'text-red-500'
                : orderData.order_status === 'shipped'
                ? 'text-blue-500'
                : 'text-orange-500'
            }`}
          >
            {orderData.order_status}
          </Text>
        </View>

        {/* Nút Cancel Order – chỉ hiển thị nếu chưa giao và chưa thành công */}
        {orderData.order_status !== 'shipped' && orderData.order_status !== 'success' && (
          <TouchableOpacity
            onPress={() => {
              cancelOrder();
              console.log('Cancel pressed');
            }}
            className="mt-8 bg-red-500 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold text-base">Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>
    )}
</ScrollView>

  );
};

export default OrderDetail;
