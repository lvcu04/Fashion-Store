// Notification.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { API } from '@/constants/api';
import { useAuth } from '@/context/authContext';
import { MaterialIcons } from '@expo/vector-icons';

// Giữ nguyên getStatusInfo như bạn đã định
const getStatusInfo = (status: string) => {
  switch (status.trim().toLowerCase()) {
    case 'paid':
      return {
        title: 'The order is paiding', // Giữ nguyên text gốc nếu bạn muốn
        label: 'Paid',
        color: '#3B82F6', // blue-500
        bgColor: '#DBEAFE', // blue-100
        icon: 'payments',
      };
    case 'success':
      return {
        title: 'The order has been completed',
        label: 'Success',
        color: '#10B981', // green-500
        bgColor: '#D1FAE5', // green-100
        icon: 'check-circle',
      };
    case 'delivered':
      return {
        title: 'The order has been shipped ',
        label: 'Delivered',
        color: '#8B5CF6', // violet-500
        bgColor: '#EDE9FE', // violet-100
        icon: 'local-shipping',
      };
    case 'cancelled':
      return {
        title: 'The order has been canceled ',
        label: 'Cancelled',
        color: '#EF4444', // red-500
        bgColor: '#FEE2E2', // red-100
        icon: 'cancel',
      };
    default:
      return {
        title: 'Unknown', // thêm title để luôn hiển thị text
        label: 'Unknown',
        color: '#6B7280', // gray-500
        bgColor: '#F3F4F6', // gray-100
        icon: 'help-outline',
      };
  }
};

// Định nghĩa type NotificationType để dùng chung
type NotificationType = {
  _id: string;
  order_id: string;
  order_date: string;
  order_status: string;
  total_price: number;
  cartItems: { image: string }[];
};

// Component con hiển thị 1 item notification
const NotificationItem: React.FC<{ item: NotificationType; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  const statusInfo = getStatusInfo(item.order_status);

  // Format ngày giờ chỉ 1 lần
  const dateObj = new Date(item.order_date);
  const dateStr = dateObj.toLocaleDateString();
  const timeStr = dateObj.toLocaleTimeString();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="mx-4 my-2 bg-white rounded-2xl shadow-md overflow-hidden"
    >
 
      <View className="px-4 py-3">

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          {item.cartItems.map((cartItem, idx) => (
            <Image
              key={idx}
              source={{ uri: cartItem.image }}
              className="w-20 h-20 rounded-lg mr-2"
            />
          ))}
        </ScrollView>


        <View>
          <Text className="text-lg font-semibold text-gray-900">
            {statusInfo.title}
          </Text>
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
            <MaterialIcons
              name={statusInfo.icon as any}
              size={20}
              color={statusInfo.color}
            />
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
          Total:{' '}
          <Text className="font-semibold text-gray-900">
            {item.total_price.toLocaleString()} VND
          </Text>
        </Text>
        <Text className="text-sm text-gray-700">
          {item.cartItems.length} product
          {item.cartItems.length > 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Component chính Notification
const Notification: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { firebaseUser } = useAuth();

  const [notification, setNotification] = useState<NotificationType[]>([]);

 
  const fetchOrderSucceeded = async (): Promise<NotificationType[]> => {
    if (!firebaseUser) return [];
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(API.order.orderSuccess, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return data as NotificationType[];
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  const fetchOrderDeliverd = async (): Promise<NotificationType[]> => {
    if (!firebaseUser) return [];
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(API.order.orderDelivey, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return data as NotificationType[];
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  const fetchOrderCancel = async (): Promise<NotificationType[]> => {
    if (!firebaseUser) return [];
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(API.order.orderCancel, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return data as NotificationType[];
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  const fetchOrderPaid = async (): Promise<NotificationType[]> => {
    if (!firebaseUser) return [];
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(API.order.orderPaid, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return data as NotificationType[];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllNotifications = async () => {
      const results = await Promise.all([
        fetchOrderSucceeded(),
        fetchOrderDeliverd(),
        fetchOrderCancel(),
        fetchOrderPaid(),
      ]);

      const mergedNotifications = results.flat();
      // Sắp xếp theo thời gian mới nhất
      mergedNotifications.sort((a, b) => {
        if (!a || !b) return 0;
        return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
      });

      setNotification(mergedNotifications);
    };

    if (firebaseUser) {
      fetchAllNotifications();
    } else {
      setNotification([]);
    }
  }, [firebaseUser]);


  const handlePressItem = useCallback((orderId: string) => {

    router.push({ pathname: '/orderDetails/[id]', params: { id: orderId } });
  }, [router]);
  useEffect(() => {
  notification.forEach(item => {
    console.log('Order status:', item.order_status);
  });
}, [notification]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 pt-6 pb-4 bg-white shadow-sm">
        <Text className="text-3xl font-bold text-gray-900">
          {t('My Notifications')}
        </Text>
      </View>

      {/* List notifications */}
      <FlatList
        data={notification}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            onPress={() => handlePressItem(item.order_id)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center mt-10 px-4">
            <Text className="text-center text-gray-500">
              {t('No notifications found')}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Notification;
