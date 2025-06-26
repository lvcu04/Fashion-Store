import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { API } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';
import { useCheckout } from '@/context/checkoutContext';
import { useTranslation } from 'react-i18next';

interface Address {
  _id: string;
  street: string;
  city: string;
  receiverName: string;
}

const SelectAddressScreen = () => {
  const { addresses, fetchAddresses, removeAddress, handleSelectAddress } = useCheckout();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { firebaseUser } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const renderAddress = ({ item }: { item: Address }) => (
    <TouchableOpacity
      onPress={() => handleSelectAddress(item)}
      className={`bg-gray-50 p-4 rounded-2xl mb-4 shadow flex-col ${
        selectedId === item._id ? 'border border-blue-500' : ''
      }`}
    >
      <View className="flex-row justify-between mb-2">
        <Text className="font-semibold text-base">{t('Name')}: {item.receiverName}</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/(checkout)/editAddress',
              params: { selectedAddress: JSON.stringify(item) },
            })
          }
        >
          <Text className="text-red-500 font-semibold">{t('Edit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeAddress(item._id)}>
          <Text className="text-red-500 font-semibold">{t('Delete')}</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-gray-700">{t('Street')}: {item.street}</Text>
      <Text className="text-gray-700">{t('City')}: {item.city}</Text>
      <View className="flex-row items-center mt-2">
        <Ionicons
          name={selectedId === item._id ? 'checkbox' : 'square-outline'}
          size={20}
          color="#000"
        />
        <Text className="ml-2 text-sm text-gray-700">{t('Use as the shipping address')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-5 mt-5">
        <Text className="text-xl font-bold">{t('Shipping Address')}</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="px-4 pt-4 flex-1">
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          renderItem={renderAddress}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      {/* Add button */}
      <TouchableOpacity
        onPress={() => router.push('/(checkout)/addAddress')}
        className="absolute bottom-6 right-6 w-12 h-12 bg-black rounded-full justify-center items-center"
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default SelectAddressScreen;
