import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { API } from '@/constants/api';
import { useAuth } from '@/context/authContext';
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
export type OrderStatus = 'pending' | 'paid' | 'delivered' | 'success' | 'cancelled';

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
  const { id: orderId } = useLocalSearchParams<{ id: string }>();
  const { firebaseUser } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [orderData, setOrderData] = useState<Order | null>();
  const [loading, setLoading] = useState(true);

  const cancelOrder = async () => {
    Alert.alert(t('Confirm Cancel'), t('Are you sure you want to cancel this order?'), [
      { text: t('No'), style: 'cancel' },
      {
        text: t('Cancel Order'),
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            const token = await firebaseUser?.getIdToken();
            const res = await fetch(API.order.cancel(orderId), {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            const result = await res.json();

            if (res.ok) {
              Alert.alert(t('Success'), t('Order has been cancelled.'));
            } else {
              Alert.alert(t('Error'), result?.error || t('Unable to cancel order.'));
            }
            router.push('/(tabs)/Order');
          } catch (err) {
            Alert.alert(t('Error'), t('An error occurred while cancelling the order.'));
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
        }
      } catch (error) {
        console.log('Fetch error:', error);
      }
    };
    fetchOrderByOrderId();
  }, [setOrderData]);

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-1 pb-10">
      {/* Back button */}
      <View className='flex flex-row pt-12 pb-4 items-center'>
        <TouchableOpacity onPress={() => router.push('/(tabs)/Order')} className="mr-4">
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-black">{t('Order Details')}</Text>
      </View>

      {orderData && (
        <View className="bg-gray-50 rounded-xl p-4 shadow-md border border-gray-200 pb-6">
          <Text className="text-xl font-semibold text-black mb-4">{t('Products')}</Text>
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
                  <Text className="text-xs text-gray-400 text-center">{t('No image')}</Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-800">{item.productName}</Text>
                <Text className="text-xs text-gray-500">
                  {t('Qty')}: {item.quantity} x {item.price.toLocaleString()}₫
                </Text>
              </View>
            </View>
          ))}

          <View className="mt-4 border-t border-gray-200 pt-4">
            <Text className="text-lg font-bold text-black">
              {t('Total')}: {orderData.total_price?.toLocaleString()}₫
            </Text>
          </View>

          <View className="mt-6">
            <Text className="text-xl font-semibold text-black mb-2">{t('Shipping Address')}</Text>
            <Text className="text-gray-700">{orderData.shipping_address.receiverName}</Text>
            <Text className="text-gray-700">{orderData.shipping_address.street}</Text>
            <Text className="text-gray-700">{orderData.shipping_address.city}</Text>
          </View>

          <View className="mt-6">
            <Text className="text-xl font-semibold text-black mb-2">{t('Payment Method')}</Text>
            <Text className="text-gray-700">{orderData.payment_method}</Text>
          </View>

          <View className="mt-6">
            <Text className="text-xl font-semibold text-black mb-2">{t('Order Status')}</Text>
            <Text
              className={`text-base font-bold ${
                orderData.order_status === 'success'
                  ? 'text-green-600'
                  : orderData.order_status === 'cancelled'
                  ? 'text-red-500'
                  : orderData.order_status === 'delivered'
                  ? 'text-blue-500'
                  : 'text-orange-500'
              }`}
            >
              {t(orderData.order_status ?? 'pending')}
            </Text>
          </View>

          {orderData.order_status !== 'delivered' && orderData.order_status !== 'success' && (
            <TouchableOpacity
              onPress={cancelOrder}
              className="mt-8 bg-red-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold text-base">{t('Cancel Order')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default OrderDetail;
