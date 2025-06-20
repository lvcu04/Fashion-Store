import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Image, Animated, TouchableOpacity } from 'react-native';
import { API } from '@/constants/api';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

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

const MyOrder = () => {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'Ongoing' | 'Completed'>('Ongoing');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 150, easing: Easing.ease }) }],
    opacity: withTiming(opacity.value, { duration: 150, easing: Easing.ease }),
  }));

  const handlePressIn = () => {
    scale.value = 0.96;
    opacity.value = 0.8;
  };

  const handlePressOut = () => {
    scale.value = 1;
    opacity.value = 1;
  };

  const fetchOrdersUid = async () => {
    try {
      const token = await firebaseUser?.getIdToken();
      const res = await fetch(API.order.allOrdersUid, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersUid();
  }, []);

  const filterOrders = (status: 'Ongoing' | 'Completed') => {
    return orders.filter((order) =>
      status === 'Ongoing'
        ? order.order_status !== 'success' && order.order_status !== 'cancelled'
        : order.order_status === 'success'
    );
  };

  const statusLabels: Record<OrderStatus, string> = {
    pending: t('pending'),
    paid: t('paid'),
    shipped: t('shipped'),
    success: t('success'),
    cancelled: t('cancelled'),
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const firstItem = item.cartItems[0];
    return (
      <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
        <View className="flex-row items-center">
          {firstItem?.image && (
            <Image
              source={{ uri: firstItem.image }}
              className="w-20 h-20 rounded-xl"
              resizeMode="contain"
            />
          )}
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-gray-900">{firstItem?.productName}</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {t('Quantity')}: {firstItem?.quantity}
            </Text>
            <Text className="text-xl font-bold text-gray-800 mt-2">
              {item.total_price?.toLocaleString("vi-VN")} VND
            </Text>
          </View>
        </View>

        <View className="border-t border-gray-200 mt-4 pt-3">
          <View className="flex-row items-start">
            <View className="flex-1">
              <Text className="text-sm text-gray-500">
                {t('Order Date')}: {new Date(item.order_date || '').toDateString()}
              </Text>
              <Text className="text-sm text-gray-500">{t('Order ID')}: {item.order_id}</Text>
            </View>

            <Text
              className={`text-sm font-semibold ml-4 ${
                item.order_status === 'success' ? 'text-green-600' : 'text-orange-500'
              }`}
            >
              {statusLabels[item.order_status ?? 'pending']}
            </Text>
          </View>

          <Animated.View style={animatedStyle} className="mt-3">
            <TouchableOpacity
              onPressIn={() => handlePressIn()}
              onPressOut={() => {
                handlePressOut();
                router.push(`/orderDetails/${item.order_id}`);
              }}
              className="bg-gray-900 rounded-full py-2 px-4 flex-row items-center justify-center"
            >
              <AntDesign name="eye" size={16} color="white" />
              <Text className="text-white font-semibold ml-2">{t('View Order')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  };

  const filteredOrders = filterOrders(activeTab);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white pt-12 pb-4 px-5">
        <Text className="text-3xl font-bold text-black ml-4">{t('My Order')}</Text>
      </View>

      <View className="bg-white px-5 pb-5">
        <View className="flex-row mt-5">
          {['Ongoing', 'Completed'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as 'Ongoing' | 'Completed')}
              className={`flex-1 py-3 rounded-full ${
                activeTab === tab ? 'bg-gray-900' : 'bg-gray-200'
              } ${tab === 'Ongoing' ? 'mr-3' : ''}`}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === tab ? 'text-white' : 'text-gray-700'
                }`}
              >
                {t(tab)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-gray-500 text-lg">{t('Loading...')}</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <AntDesign name="shoppingcart" size={50} color="#d1d5db" />
          <Text className="text-xl font-semibold text-gray-500 mt-4">
            {t(`No ${activeTab} Orders`)}
          </Text>
          <Text className="text-sm text-gray-400 mt-2">
            {t('Start shopping to see your orders here!')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id ?? item.order_id ?? Math.random().toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View className="h-6" />}
        />
      )}
    </View>
  );
};

export default MyOrder;
