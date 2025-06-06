import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { useCart } from "@/context/cartContext";
import { useAuth } from '@/context/authContext';
import { AntDesign } from '@expo/vector-icons';
type CartItem = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
};
const Checkout = () => {
  const router = useRouter();
  const { cartItems,fetchCartItems, removeCartItem, updateQuantityCartItem } = useCart();
  const { firebaseUser } = useAuth();
  const [deliveryMethod, setDeliveryMethod] = useState('fedex');
  //nút đồng bộ lên server
  const handleCheckout = () => {
    //Sync localCart lên server
    // syncCartWithServer(localCart);
  };
 

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryCost = 15;
  const summary = totalPrice + deliveryCost;
  const CartItem = ({ item }: { item: CartItem }) => {
  return (
    <View className="flex-row items-center mb-4">
      <Image
        source={{ uri: item.image }}
        style={{ width: 60, height: 60, borderRadius: 10 }}
      />
      <View className="ml-4 flex-1">
        <Text className="font-semibold text-base">{item.productName}</Text>
        <Text className="text-gray-600">${item.price} x {item.quantity}</Text>
      </View>
    </View>
  );
};

  return (
    <ScrollView className="flex-1 bg-white p-5">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-4">Checkout</Text>
      </View>
      {/* Mycart */}
    <Text className="text-lg font-bold mb-2">My Cart</Text>
    <View className="bg-white p-4 rounded-2xl shadow mb-6">
      {cartItems.length === 0 ? (
        <Text className="text-gray-500 text-center">Your cart is empty.</Text>
      ) : (
        cartItems.map((item) => (
          <TouchableOpacity
            key={item.product_id}
            onPress={() =>
              router.push('/(cart)/Cart')}
          
            className="mb-4"
          >
            <View className="flex-row items-center">
              <Image
                source={{ uri: item.image }}
                style={{ width: 60, height: 60, borderRadius: 10 }}
              />
              <View className="ml-4 flex-1">
                <Text className="font-semibold text-base">{item.productName}</Text>
                <Text className="text-gray-600">
                  ${item.price} x {item.quantity}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
    
      {/* Shipping address */}
      <Text className="text-lg font-bold mb-2">Shipping address</Text>
      <View className="bg-white p-4 rounded-2xl shadow mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-base font-semibold">Jane Doe</Text>
          <Text className="text-gray-600">3 Newbridge Court</Text>
          <Text className="text-gray-600">Chino Hills, CA 91709, United States</Text>
        </View>
        <TouchableOpacity>
          <Text className="text-red-500 font-semibold">Change</Text>
        </TouchableOpacity>
      </View>

      {/* Payment */}
      <Text className="text-lg font-bold mb-2">Payment</Text>
      <View className="bg-white p-4 rounded-2xl shadow mb-6 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image
            source={{ uri: "https://img.icons8.com/color/48/mastercard-logo.png" }}
            style={{ width: 40, height: 30 }}
            resizeMode="contain"
          />
          <Text className="ml-4 text-base">**** **** **** 3947</Text>
        </View>
        <TouchableOpacity
        onPress={() => {
         router.push("/(card)/Card") 
        }
        }
        >
          <Text className="text-red-500 font-semibold">Change</Text>
        </TouchableOpacity>
      </View>

      {/* Delivery Method */}
      <Text className="text-lg font-bold mb-2">Delivery method</Text>
      <View className="flex-row justify-between mb-6">
        {['fedex', 'usps', 'dhl'].map((method) => (
          <TouchableOpacity
            key={method}
            className={`w-[30%] items-center p-3 rounded-2xl shadow ${
              deliveryMethod === method ? 'bg-gray-200' : 'bg-white'
            }`}
            onPress={() => setDeliveryMethod(method)}
          >
            <Image
              source={{
                uri:
                  method === 'fedex'
                    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/FedEx_Express.svg/512px-FedEx_Express.svg.png'
                    : method === 'usps'
                    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/USPS_logo.svg/512px-USPS_logo.svg.png'
                    : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/DHL_Logo.svg/512px-DHL_Logo.svg.png',
              }}
              style={{ width: 60, height: 30 }}
              resizeMode="contain"
            />
            <Text className="text-sm mt-1 text-gray-600">2-3 days</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Order summary */}
      <View className="mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Order:</Text>
          <Text className="text-base font-semibold">${totalPrice.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Delivery:</Text>
          <Text className="text-base font-semibold">${deliveryCost}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold">Summary:</Text>
          <Text className="text-lg font-bold">${summary.toFixed(2)}</Text>
        </View>
      </View>

      {/* Submit Order */}
      <View className="mt-8 mb-12">
        <TouchableOpacity
          onPress={() => {handleCheckout();
            router.push('/')}}
          className="bg-red-500 p-4 rounded-xl"
        >
          <Text className="text-white text-center text-lg font-bold">
            SUBMIT ORDER
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

export default Checkout;
