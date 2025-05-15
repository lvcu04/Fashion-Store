import { View, TextInput, Button, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useState } from 'react';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = () => {
    console.log({ name, price }); // xử lý gửi lên Mongo sau
  };

  return (
    <View className="p-4 mt-5">
      <Text className="bg-blue-200 text-3xl items-center font-bold p-5 mb-4 pl-14">Thêm sản phẩm mới</Text>

      <TextInput
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
      />

      <TextInput
        placeholder="Giá"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
      />
      <TouchableOpacity onPress={handleAdd}>
        <View className="bg-blue-400 items-center rounded-xl p-4 mb-3 shadow">
          <Text className="font-semibold">Thêm sản phẩm</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
