import {useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { useCart } from "@/context/cartContext";
import { useAuth } from '@/context/authContext';
import { AntDesign } from '@expo/vector-icons';
import { API } from '@/constants/api';
import { useCheckout } from '@/context/checkoutContext';
import { Linking } from 'react-native';
type CartItem = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
};
interface Address {
  _id: string;
  street: string;
  city: string;
  receiverName: string;
}
interface Order{
  uid: string;
  cartItems: CartItem[];
  total_price: number;
  shipping_address: Address;
  payment_method: PaymentMethodType;
  order_status: string; // "pending" | "placed"
}
type PaymentMethodType = "COD" | "MOMO";

interface PaymentMethod {
  _id: string;
  type: PaymentMethodType;
  isDefault: boolean;
}
const Checkout = () => {
  const router = useRouter();
  const {
      cart: cartItems, // dùng trực tiếp từ server
      fetchCartItems,
      // removeCartItem,
      // updateQuantity,
      totalPrice,
      stockMap,
      loadAllStocks,
    } = useCart();
  const { firebaseUser } = useAuth();
  const { selectedAddress, fetchDefaultPaymentMethod, selectedPaymentMethod, resetCheckoutContext  } = useCheckout(); //lấy hàm từ checkoutContext
  // const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [createOrder] = useState<Order | null>(null);


  
 
  useEffect(() => {
    if (firebaseUser) {
      fetchDefaultPaymentMethod();
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (selectedAddress) {
      setAddress(selectedAddress); // Gán trực tiếp nếu là object
    }
  }, [selectedAddress]);

  const [deliveryMethod, setDeliveryMethod] = useState('fedex');
  //nút đồng bộ lên server
 const handleCheckout = async () => {
  // console.log('dữ liệu paymentMethod:', selectedPaymentMethod);
  console.log('dữ liệu address:', address);
  if (!firebaseUser) return;

  const token = await firebaseUser.getIdToken();

  const payload = {
    uid: firebaseUser.uid,
    cartItems,
    total_price: totalPrice, 
    shipping_address: address,
    payment_method: selectedPaymentMethod,
    order_status: selectedPaymentMethod === 'MOMO' ? 'paid' : 'pending'

  };

  try {
    if (selectedPaymentMethod === 'COD') {
      const res = await fetch(API.order.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('✅ COD Order created:', data);
    } else if (selectedPaymentMethod === 'MOMO') {
      const res = await fetch(API.momo.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const momoData = await res.json();
      if (momoData.payUrl) {
        console.log('✅ MoMo Order created:', momoData.payUrl);
        Linking.openURL(momoData.payUrl); // mở trình duyệt hoặc app MoMo
      } else {
        console.error('❌ Lỗi Momo:', momoData);
      }
    }
  } catch (error) {
    console.error('❌ Checkout error:', error);
  }
};

 


  // const deliveryCost = 15;
  const summary = totalPrice;
//   const CartItem = ({ item }: { item: CartItem }) => {
//   return (
//     <View className="flex-row items-center mb-4">
//       <Image
//         source={{ uri: item.image }}
//         style={{ width: 60, height: 60, borderRadius: 10 }}
//       />
//       <View className="ml-4 flex-1">
//         <Text className="font-semibold text-base">{item.productName}</Text>
//         <Text className="text-gray-600">${item.price} x {item.quantity}</Text>
//       </View>
//     </View>
//   );
// };

  return (
    <ScrollView className="flex-1 bg-white p-5">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.push('/(cart)/Cart')}>
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
              {address ? (
        <>
          <Text className="text-base font-semibold">{address.receiverName}</Text>
          <Text className="text-gray-600">{address.street}</Text>
          <Text className="text-gray-600">{address.city}</Text>
        </>
      ) : (
        <Text className="text-gray-600">No address selected</Text>
      )}

        </View>
        <TouchableOpacity
        onPress={() => router.push('/(checkout)/checkoutAddress')}
        >
          <Text className="text-red-500 font-semibold">Change</Text>
        </TouchableOpacity>
      </View>

      {/* Payment */}
      <Text className="text-lg font-bold mb-2">Payment</Text>
      <View className="bg-white p-4 rounded-2xl shadow mb-6 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image
            source={{
              uri:
                selectedPaymentMethod === "COD"
                  ? "https://img.icons8.com/ios-filled/50/money.png"
                  : "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
            }}
            style={{ width: 40, height: 30 }}
            resizeMode="contain"
          />
         <Text className="ml-4 text-base">
          {selectedPaymentMethod ? selectedPaymentMethod : "No method selected"}
        </Text>

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
      {/* <Text className="text-lg font-bold mb-2">Delivery method</Text>
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
      </View> */}

      {/* Order summary */}
      <View className="mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Order:</Text>
          <Text className="text-base font-semibold">{totalPrice.toLocaleString("vi-VN")} VND</Text>
        </View>
        {/* <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Delivery:</Text>
          <Text className="text-base font-semibold">${deliveryCost}</Text>
        </View> */}
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold">Summary:</Text>
          <Text className="text-lg font-bold">{summary.toLocaleString("vi-VN")} VND</Text>
        </View>
      </View>

      {/* Submit Order */}
      <View className="mt-8 mb-12">
        <TouchableOpacity
          onPress={async () => {handleCheckout();
            await fetchCartItems(); // cập nhật lại cart sau khi backend đã xóa cart
            await loadAllStocks([]); // gọi lại để cập nhật tồn kho mới nhất
            router.push('/(checkout)/success');}}
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
