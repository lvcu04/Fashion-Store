import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity,Text} from 'react-native';

import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    products: 10,
    orders: 5,
    users: 3,
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} className=" mt-5">
      <Text className="bg-blue-300 text-3xl font-bold mb-5 pl-20 p-5">Xin chào Admin!</Text>

      <TouchableOpacity onPress={() => router.push('/(admin)/products')}>
        <View className="bg-slate-400 rounded-xl p-4 mb-4 shadow-md">
          <Text className="text-xl font-semibold mb-1">Sản phẩm</Text>
          <Text>{summary.products} sản phẩm</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(admin)/orders')}>
        <View className="bg-slate-400 rounded-xl p-4 mb-4 shadow-md">
          <Text className="text-xl font-semibold mb-1">Đơn hàng</Text>
          <Text>{summary.orders} đơn hàng</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(admin)/users')}>
        <View className="bg-slate-400 rounded-xl p-4 mb-4 shadow-md">
          <Text className="text-xl font-semibold mb-1">Người dùng</Text>
          <Text>{summary.users} người dùng</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
