import { View, ScrollView, TouchableOpacity,Text } from 'react-native';


const fakeOrders = [
  { id: 'OD001', customer: 'Nguyễn Văn A', total: 500000 },
  { id: 'OD002', customer: 'Trần Thị B', total: 780000 },
];

export default function OrdersPage() {
  return (
    <ScrollView className="p-4 mt-5">
      <Text className="bg-blue-200 text-3xl items-center font-bold p-5 mb-4 pl-20">Đơn hàng</Text>
      {fakeOrders.map((order) => (
        <View key={order.id} className="bg-slate-300 rounded-xl p-4 mb-3 shadow">
          <Text className="font-semibold">Mã đơn: {order.id}</Text>
          <Text>Khách hàng: {order.customer}</Text>
          <Text>Tổng tiền: {order.total.toLocaleString()}₫</Text>
        </View>
      ))}

      <View>
      <TouchableOpacity>
          <View className="bg-blue-400 items-center rounded-xl p-4 mb-3 shadow">
            <Text className="font-semibold">Chỉnh sửa đơn hàng</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
