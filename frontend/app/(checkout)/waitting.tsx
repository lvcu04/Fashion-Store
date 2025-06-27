import React, { useCallback } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { API } from '@/constants/api';

const WaitingForPayment = () => {
  const { firebaseUser } = useAuth();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
    let interval: ReturnType<typeof setInterval>;//khai báo tên biến interval với kiểu dữ liệu loại trả về của hàm serInterval
        //khai báo cách này để lưu biến tạm thời thay vì dùng usestate để render lại. Hỗ trợ cho việc cấp Id cho clearInterval dừng lặp
      const checkOrderStatus = async () => {
        try {
          if (!firebaseUser) return;
          const token = await firebaseUser.getIdToken();

          const res = await fetch(API.order.orderPaid, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await res.json();
          console.log("🔁 Đợi xác nhận thanh toán:", data);

          if (Array.isArray(data) && data.length > 0 && data[0].order_status === 'paid') {
            clearInterval(interval);// tránh việc lặp và ko tiếp tục kiểm tra trạng thái đơn hàng không cần thiết nữa
            router.replace('/(checkout)/success');
          }
        } catch (error) {
          console.error("❌ Lỗi kiểm tra đơn hàng khi đợi thanh toán:", error);
        }
      };

      interval = setInterval(checkOrderStatus, 5000);

      return () => clearInterval(interval);//Nếu không clear, timer sẽ tiếp tục chạy kể cả khi component đã bị huỷ.
    }, [firebaseUser])
  );

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#ff3d71" />
      <Text className="mt-4 text-lg font-semibold text-gray-700">
        Đang xác nhận thanh toán...
      </Text>
      <Text className="text-sm text-gray-500 mt-2 text-center px-6">
        Vui lòng không thoát ứng dụng trong lúc xử lý.
      </Text>
    </View>
  );
};

export default WaitingForPayment;
