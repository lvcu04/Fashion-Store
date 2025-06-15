import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/authContext';
import { API } from '@/constants/api';

const EditAddressScreen = () => {
  const { firebaseUser } = useAuth();
  const router = useRouter();
  const { selectedAddress } = useLocalSearchParams();//bên editAddress.tsx sẽ lấy giá trị đã được truyền từ router vs tham số selectedAddress

  const [addressId, setAddressId] = useState('');
  const [receiver, setReceiver] = useState('');
  const [streetName, setStreetName] = useState('');
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    // Kiểm tra xem selectedAddress có tồn tại và là kiểu string hay ko, Nếu có thì chuyển đổi nó từ JSON string về object
    if (selectedAddress) {
      const parsed = JSON.parse(selectedAddress as string);
      setAddressId(parsed._id);
      setReceiver(parsed.receiverName);
      setStreetName(parsed.street);
      setCityName(parsed.city);
    }
  }, [selectedAddress]);//gọi lại nếu như có sự thay đổi 

  const handleUpdateAddress = async () => {
    if (!receiver || !streetName || !cityName) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const token = await firebaseUser?.getIdToken();
      const res = await fetch(API.user.updateAddress, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({//chuyển lại từ object sang JSON string để gửi vào server
          address: [{
            _id: addressId,
            receiverName: receiver,
            street: streetName,
            city: cityName,
          }],
        }),
      });

      if (res.ok) {
        Alert.alert('Thành công', 'Cập nhật địa chỉ thành công.');
        router.push('/(checkout)/checkoutAddress');
      } else {
        const errText = await res.text();
        console.error('Update failed:', errText);
        Alert.alert('Lỗi', 'Không thể cập nhật địa chỉ.');
      }
    } catch (err) {
      console.error('Error updating address:', err);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật địa chỉ.');
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Edit Address</Text>
      </View>

      <Text className="mb-1">Full Name</Text>
      <TextInput
        value={receiver}
        onChangeText={setReceiver}
        placeholder="Enter receiver name"
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
      />

      <Text className="mb-1">Street</Text>
      <TextInput
        value={streetName}
        onChangeText={setStreetName}
        placeholder="Enter street"
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
      />

      <Text className="mb-1">City</Text>
      <TextInput
        value={cityName}
        onChangeText={setCityName}
        placeholder="Enter city"
        className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
      />

      <TouchableOpacity
        onPress={handleUpdateAddress}
        className="bg-black py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditAddressScreen;
