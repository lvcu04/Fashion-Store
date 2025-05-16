import { router } from 'expo-router';
import { ScrollView, View, TouchableOpacity  } from 'react-native';
import { Text } from 'react-native-paper';

const fakeProducts = [
  { id: 'SP001', name: 'Áo thun', price: 200000 },
  { id: 'SP002', name: 'Quần jean', price: 400000 },
];

export default function ProductsPage() {
  return (
    <ScrollView className="p-4 mt-5">
   

      <Text className="bg-blue-200 w-full text-3xl font-bold p-5 mb-4">Sản phẩm</Text>

      {fakeProducts.map((p) => (
        <View key={p.id} className="bg-slate-400 rounded-xl p-4 mb-5 shadow">
          <Text className="font-semibold">{p.name}</Text>
          <Text>Giá: {p.price.toLocaleString()}₫</Text>
        </View>
      ))}
      <View className='flex-row justify-between'>
        <TouchableOpacity>
          <View className="bg-blue-400 items-center rounded-xl p-4 mb-3 shadow">
            <Text className="font-semibold">Chỉnh sửa sản phẩm</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(admin)/products/addProducts')}>
          <View className="bg-blue-400 items-center rounded-xl p-4 mb-3 shadow">
            <Text className="font-semibold">Thêm sản phẩm</Text>
          </View>
        </TouchableOpacity>
      </View>
      
    </ScrollView>
    
  );
}
