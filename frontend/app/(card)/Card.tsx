import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { API } from '@/constants/api';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import { useCheckout } from '@/context/checkoutContext';
// types/payment.ts

type PaymentMethodType = 'COD' | 'MOMO';

interface PaymentMethod {
  _id?: string;
  type: PaymentMethodType;
  isDefault?: boolean;
}


const MyCard = () => {
    const { firebaseUser } = useAuth();
    const router = useRouter();
    const { methods,
        fetchPaymentMethods,
        handleSelectMethod,} = useCheckout(); // lấy hàm từ checkoutContext

  useEffect(() => {
    if (firebaseUser) {
      fetchPaymentMethods();
      console.log('Methods sau khi fetch xong:', methods);
    }
  }, []);



  return (
    <View className="flex-1 bg-white">
      <Text className="text-xl font-bold px-4 py-6">My Payment Methods</Text>

      {Array.isArray(methods) &&
      methods.map((method) => (
        <TouchableOpacity
          key={method.type}
          className="flex-row items-center justify-between border-b border-gray-200 py-4 px-4"
          onPress={() => handleSelectMethod(method.type)}
        >
          <View className="flex-row items-center">
            <FontAwesome
              name={method.type === "MOMO" ? "mobile" : "money"}
              size={24}
              color={method.type === "MOMO" ? "#D82D8B" : "#22C55E"}
            />
            <Text className="ml-4 text-base">{method.type}</Text>
          </View>
          <FontAwesome
            name={method.isDefault ? "check-circle" : "circle-o"}
            size={24}
            color={method.isDefault ? "#22C55E" : "#9CA3AF"}
          />
        </TouchableOpacity>
      ))}

      {/* Add Card Placeholder */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 px-4 mt-6 border-t border-gray-200"
        onPress={() => Alert.alert("Coming Soon", "Card support will be added later.")}
      >
        <View className="flex-row items-center">
          <FontAwesome name="plus" size={24} color="#6366F1" />
          <Text className="ml-4 text-base text-indigo-600 font-medium">Add Card</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MyCard;
