import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  AppState,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { API } from '@/constants/api';
import { useAuth } from '@/context/authContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const NotificationItem: React.FC<{ item: NotificationType; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  const { t } = useTranslation();

  const getStatusInfo = (status: string) => {
    switch (status.trim().toLowerCase()) {
      case 'paid':
        return {
          title: t('The order is paiding'),
          label: t('Paid'),
          color: '#3B82F6',
          bgColor: '#DBEAFE',
          icon: 'payments',
        };
      case 'success':
        return {
          title: t('The order has been completed'),
          label: t('Success'),
          color: '#10B981',
          bgColor: '#D1FAE5',
          icon: 'check-circle',
        };
      case 'delivered':
        return {
          title: t('The order has been shipped'),
          label: t('Delivered'),
          color: '#8B5CF6',
          bgColor: '#EDE9FE',
          icon: 'local-shipping',
        };
      case 'cancelled':
        return {
          title: t('The order has been canceled'),
          label: t('Cancelled'),
          color: '#EF4444',
          bgColor: '#FEE2E2',
          icon: 'cancel',
        };
      default:
        return {
          title: t('Unknown'),
          label: t('Unknown'),
          color: '#6B7280',
          bgColor: '#F3F4F6',
          icon: 'help-outline',
        };
    }
  };

  const statusInfo = getStatusInfo(item.order_status);
  const dateObj = new Date(item.order_date);
  const dateStr = dateObj.toLocaleDateString();
  const timeStr = dateObj.toLocaleTimeString();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="my-2 bg-white rounded-2xl shadow-md overflow-hidden"
    >
      <View className="px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          {item.cartItems.map((cartItem, idx) => (
            <Image
              key={idx}
              source={{ uri: cartItem.image }}
              className="w-20 h-20 rounded-lg mr-2"
            />
          ))}
        </ScrollView>

        <View>
          <Text className="text-lg font-semibold text-gray-900">{statusInfo.title}</Text>
          <Text className="text-base font-semibold text-gray-800 mt-1">
            #{item.order_id.slice(0, 8)}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {dateStr} {timeStr}
          </Text>
          <View
            className="mt-1 mb-2 px-2 py-1 rounded-full self-start flex flex-row items-center"
            style={{ backgroundColor: statusInfo.bgColor }}
          >
            <MaterialIcons name={statusInfo.icon as any} size={20} color={statusInfo.color} />
            <Text
              className="text-xs font-medium ml-1 uppercase"
              style={{ color: statusInfo.color }}
            >
              {statusInfo.label}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
        <Text className="text-sm text-gray-700">
          {t('Total')}:{" "}
          <Text className="font-semibold text-gray-900">
            {item.total_price.toLocaleString()} VND
          </Text>
        </Text>
        <Text className="text-sm text-gray-700">
          {item.cartItems.length}{' '}
          {t(item.cartItems.length > 1 ? 'products' : 'product')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

type NotificationType = {
  _id: string;
  order_id: string;
  order_date: string;
  order_status: string;
  total_price: number;
  cartItems: { image: string }[];
};

const Notification: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { firebaseUser } = useAuth();

  const [notification, setNotification] = useState<NotificationType[]>([]);

  const fetchNotificationsByStatus = async (url: string): Promise<NotificationType[]> => {
    if (!firebaseUser) return [];
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchAllNotifications = async () => {
    if (!firebaseUser) {
      setNotification([]);
      return;
    }

    const [succeeded, delivered, cancelled, paid] = await Promise.all([
      fetchNotificationsByStatus(API.order.orderSuccess),
      fetchNotificationsByStatus(API.order.orderDelivey),
      fetchNotificationsByStatus(API.order.orderCancel),
      fetchNotificationsByStatus(API.order.orderPaid),
    ]);

    const merged = [...succeeded, ...delivered, ...cancelled, ...paid];
    merged.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());

    setNotification(merged);
  };

  useEffect(() => {
    if (firebaseUser) {
      fetchAllNotifications();
    }
  }, [firebaseUser]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active' && firebaseUser) fetchAllNotifications();
    });
    return () => sub.remove();
  }, [firebaseUser]);

  useFocusEffect(
    useCallback(() => {
      if (firebaseUser) {
        fetchAllNotifications();
      }
    }, [firebaseUser])
  );

  const handlePressItem = (orderId: string) => {
    router.push({ pathname: '/orderDetails/[id]', params: { id: orderId } });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-12 pb-4 px-5 bg-white">
        <Text className="text-3xl font-bold text-gray-900">{t('My Notifications')}</Text>
      </View>

      <FlatList
        data={notification}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={() => handlePressItem(item.order_id)} />
        )}
        ListEmptyComponent={
          <View className="items-center mt-10 px-4">
            <Text className="text-center text-gray-500">{t('No notifications found')}</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Notification;
