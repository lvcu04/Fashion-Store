import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

const MyCard = () => {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState("VietcomBank");
  const [showAddCard, setShowAddCard] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const savedCards = [
    {
      type: "VietcomBank",
      number: "9704 0012 3456 7890",
      holder: "Nguyen Van Nam",
      expiry: "12/27",
      isCard: true,
    },
    {
      type: "MoMo",
      number: "QR Code",
      holder: "Tran Thi Hoa",
      expiry: "Linked",
      isCard: false,
    },
    {
      type: "ZaloPay",
      number: "QR Code",
      holder: "Le Minh Tuan",
      expiry: "Linked",
      isCard: false,
    },
  ];

  const paymentMethods: {
    label: string;
    icon: "credit-card" | "mobile" | "mobile-phone" | "shopping-cart";
    color: string;
    bgColor: string;
  }[] = [
    {
      label: "VietcomBank",
      icon: "credit-card",
      color: "#007A33",
      bgColor: "#007A33",
    },
    { label: "MoMo", icon: "mobile", color: "#D82D8B", bgColor: "#D82D8B" },
    {
      label: "ZaloPay",
      icon: "mobile-phone",
      color: "#0068FF",
      bgColor: "#0068FF",
    },
    {
      label: "ShopeePay",
      icon: "shopping-cart",
      color: "#EE4D2D",
      bgColor: "#EE4D2D",
    },
  ];

  const handleConfirmPayment = () => {
    setShowSuccessModal(true);
  };

  const handleCardSelect = (index: number) => {
    setSelectedCardIndex(index);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-white pt-12 pb-4 px-5 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-black ml-4">Payment</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {!showAddCard && savedCards.length > 0 && (
          <View className="mb-6">
            <View className="flex-row justify-between mb-4">
              {savedCards.map((card, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-1 mx-1 p-2 rounded-lg ${
                    selectedCardIndex === index ? "bg-blue-200" : "bg-gray-200"
                  }`}
                  onPress={() => handleCardSelect(index)}
                >
                  <Text className="text-center text-sm font-semibold">
                    {card.type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Animated.View
              className="rounded-lg p-4"
              style={{
                backgroundColor:
                  paymentMethods.find(
                    (method) =>
                      method.label === savedCards[selectedCardIndex].type
                  )?.bgColor || "#4B5563",
                opacity: fadeAnim,
                transform: [
                  {
                    translateX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              }}
            >
              <Text className="text-lg font-bold text-white">
                {savedCards[selectedCardIndex].type}
              </Text>

              {savedCards[selectedCardIndex].isCard ? (
                <>
                  <Text className="mt-2 text-base text-white">CARD NUMBER</Text>
                  <Text className="text-lg text-white">
                    {savedCards[selectedCardIndex].number}
                  </Text>
                  <View className="mt-2 flex-row justify-between">
                    <View>
                      <Text className="text-sm text-white">CARD HOLDER</Text>
                      <Text className="text-base text-white">
                        {savedCards[selectedCardIndex].holder}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-sm text-white">VALID THRU</Text>
                      <Text className="text-base text-white">
                        {savedCards[selectedCardIndex].expiry}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <Text className="mt-2 text-base text-white">E-WALLET</Text>
                  <View className="mt-4 items-center">
                    <FontAwesome name="qrcode" size={40} color="white" />
                    <Text className="mt-2 text-base text-white">
                      Scan QR Code to pay
                    </Text>
                  </View>
                  <View className="mt-2">
                    <Text className="text-sm text-white">ACCOUNT</Text>
                    <Text className="text-base text-white">
                      {savedCards[selectedCardIndex].holder}
                    </Text>
                  </View>
                </>
              )}
            </Animated.View>
          </View>
        )}

        {showAddCard && (
          <View className="mb-6 rounded-lg bg-white p-4 shadow">
            <Text className="mb-4 text-lg font-semibold">Card Details</Text>
            {["Card number", "Expiry date", "CVV code"].map(
              (placeholder, index) => (
                <View
                  key={index}
                  className="mb-4 rounded-lg border border-gray-300 p-2"
                >
                  <Text className="text-gray-500">{placeholder}</Text>
                </View>
              )
            )}
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="flex-1 mr-2 items-center rounded-lg bg-gray-200 p-3"
                onPress={() => setShowAddCard(false)}
              >
                <Text className="font-semibold text-black">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 items-center rounded-lg bg-black p-3"
                onPress={() => setShowAddCard(false)}
              >
                <Text className="font-semibold text-white">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!showAddCard && (
          <View className="mb-6 rounded-lg bg-white p-4 shadow">
            <Text className="mb-4 text-lg font-semibold">Payment Methods</Text>
            {paymentMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between border-b border-gray-200 py-4 px-4"
                style={{ backgroundColor: `${method.bgColor}15` }}
                onPress={() => setSelectedPayment(method.label)}
              >
                <View className="flex-row items-center">
                  <FontAwesome
                    name={method.icon}
                    size={24}
                    color={method.color}
                  />
                  <Text className="ml-4 text-base">{method.label}</Text>
                </View>
                <FontAwesome
                  name={
                    selectedPayment === method.label
                      ? "check-circle"
                      : "circle-o"
                  }
                  size={24}
                  color={
                    selectedPayment === method.label ? "#000000" : "#6B7280"
                  }
                />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="flex-row items-center justify-center py-4"
              onPress={() => setShowAddCard(true)}
            >
              <FontAwesome name="plus" size={20} color="#000000" />
              <Text className="ml-2 text-base">Add New Card</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {!showAddCard && (
        <View className="p-4">
          <TouchableOpacity
            className="items-center rounded-lg bg-red-600 p-4"
            onPress={handleConfirmPayment}
          >
            <Text className="text-lg font-semibold text-white">
              Confirm Payment
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-3/4 items-center rounded-lg bg-white p-6">
            <FontAwesome name="check-circle" size={50} color="#4CAF50" />
            <Text className="mt-4 text-xl font-bold">Payment Successful!</Text>
            <Text className="mt-2 text-center text-gray-500">
              Your transaction has been confirmed successfully
            </Text>
            <TouchableOpacity
              className="mt-6 w-full items-center rounded-lg bg-red-600 p-3"
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/profile");
              }}
            >
              <Text className="font-semibold text-white">
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyCard;
