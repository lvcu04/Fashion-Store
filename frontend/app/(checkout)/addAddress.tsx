import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { API } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';

const AddAddressScreen = () => {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const [receiverName, setReceiverName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  const handleAddAddress = async () => {
    if (!receiverName || !street || !city) {
      Alert.alert('Missing info', 'Please fill in all fields');
      return;
    }

    try {
      const token = await firebaseUser?.getIdToken();

      const res = await fetch(API.user.createAddress, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            address: [
                {//do _id tự tạo nê ko cần khai báo ở đây khi add vào server
                receiverName,
                street,
                city,
                },
            ],
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to add address: ${error}`);
      }

      const data = await res.json();
      console.log('Address created:', data);
      router.back(); // hoặc router.push('/(checkout)/checkoutAddress');
    } catch (error) {
      console.error('Error creating address:', error);
      Alert.alert('Error', 'Something went wrong while saving address.');
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
      <View className="mb-6 flex flex-row justify-between">
        <Text className="text-xl font-bold">Add New Address</Text>
        <TouchableOpacity onPress={() => router.push('/(checkout)/checkout')}><Ionicons name='arrow-back' size={24}/></TouchableOpacity>
      </View>

      {/* Form fields */}
      <Text className="mb-1 text-gray-700">Full Name</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
        placeholder="e.g. John Doe"
        value={receiverName}
        onChangeText={setReceiverName}
      />

      <Text className="mb-1 text-gray-700">Street</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
        placeholder="e.g. 123 Main St"
        value={street}
        onChangeText={setStreet}
      />

      <Text className="mb-1 text-gray-700">City</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-2 mb-6"
        placeholder="e.g. New York"
        value={city}
        onChangeText={setCity}
      />

      {/* Save button */}
      <TouchableOpacity
        onPress={handleAddAddress}
        className="bg-black py-3 rounded-xl items-center"
      >
        <Text className="text-white text-base font-semibold">Save Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddAddressScreen;
