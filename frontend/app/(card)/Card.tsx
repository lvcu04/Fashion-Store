import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { API } from '@/constants/api';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import { useCheckout } from '@/context/checkoutContext';
import { useTranslation } from 'react-i18next';

type PaymentMethodType = 'COD' | 'MOMO';

interface PaymentMethod {
  _id?: string;
  type: PaymentMethodType;
  isDefault?: boolean;
}

const MyCard = () => {
  const { firebaseUser } = useAuth();
  const router = useRouter();
  const { methods, fetchPaymentMethods, handleSelectMethod } = useCheckout();
  const { t } = useTranslation();

  useEffect(() => {
    if (firebaseUser) {
      fetchPaymentMethods();
      console.log('Methods sau khi fetch xong:', methods);
    }
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="mb-6 flex flex-row justify-between mt-6">
        <Text className="text-xl ml-2 font-bold">
          {t("My Payment Methods")}
        </Text>
        <TouchableOpacity
          className="mr-2"
          onPress={() => router.push('/(checkout)/checkout')}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
      </View>

      {/* Payment method list */}
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
              <Text className="ml-4 text-base">
                {method.type === "MOMO" ? t("Momo") : t("Cash on Delivery")}
              </Text>
            </View>
            <FontAwesome
              name={method.isDefault ? "check-circle" : "circle-o"}
              size={24}
              color={method.isDefault ? "#22C55E" : "#9CA3AF"}
            />
          </TouchableOpacity>
        ))}

      {/* Add card (future) */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 px-4 mt-6 border-t border-gray-200"
        onPress={() =>
          Alert.alert(t("Coming Soon"), t("Card support will be added later."))
        }
      >
        <View className="flex-row items-center">
          <FontAwesome name="plus" size={24} color="#6366F1" />
          <Text className="ml-4 text-base text-indigo-600 font-medium">
            {t("Add Card")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MyCard;
