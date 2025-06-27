import {useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, FlatList, AppState } from 'react-native';
import { useCart } from "@/context/cartContext";
import { useAuth } from '@/context/authContext';
import { AntDesign } from '@expo/vector-icons';
import { API } from '@/constants/api';
import { useCheckout } from '@/context/checkoutContext';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    if (selectedAddress) {
      setAddress(selectedAddress); // Gán trực tiếp nếu là object
    }
  }, [selectedAddress]);

   useEffect(() => {
    if (firebaseUser) {
      fetchDefaultPaymentMethod();
    }
  }, [firebaseUser]);


  const [deliveryMethod, setDeliveryMethod] = useState('fedex');
  //nút đồng bộ lên server
  const handleCheckout = async () => {
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
        // console.log('✅ COD Order created:', data);
        router.push('/(checkout)/success'); 
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
          if (momoData.deeplinkMiniApp) {//link này sẽ chờ ở trang thanh toán sau đó mở trang thanh toán của momo luôn
            await router.push('/(checkout)/waitting'); // Chuyển sang trang /waiting
            // Đợi 5 giây trước khi mở MoMo
            setTimeout(() => {
              Linking.openURL(momoData.deeplinkMiniApp);
              console.log('✅ Đã mở mini app momo:', momoData.deeplinkMiniApp);
            }, 4000);
          }else if (momoData.deeplink) {//link này mở thẳng qua trang thanh toán, ko qua màn hình chờ
            await Linking.openURL(momoData.deeplink);
            console.log('đã mở deeplink momo');
          } else {
            await Linking.openURL(momoData.payUrl);//link này phải nhảy qua link gg r mới nhảy vào
            console.log('đã mở payUrl momo');
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
        <View className="flex-row items-center pt-12 pb-4 ">
          <TouchableOpacity onPress={() => router.push('/(cart)/Cart')}>
            <AntDesign name="arrowleft" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold ml-4">{t('Checkout')}</Text>
        </View>

        {/* Mycart */}
        <Text className="text-lg font-bold mb-2">{t('My Cart')}</Text>
        <View className="bg-white p-4 rounded-2xl shadow mb-6">
          {cartItems.length === 0 ? (
            <Text className="text-gray-500 text-center">{t('Your cart is empty')}.</Text>
          ) : (
            cartItems.map((item) => (
              <TouchableOpacity
                key={item.product_id}
                onPress={() => router.push('/(cart)/Cart')}
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
        <Text className="text-lg font-bold mb-2">{t('Shipping address')}</Text>
        <View className="bg-white p-4 rounded-2xl shadow mb-6 flex-row justify-between items-center">
          <View>
            {address ? (
              <>
                <Text className="text-base font-semibold">{address.receiverName}</Text>
                <Text className="text-gray-600">{address.street}</Text>
                <Text className="text-gray-600">{address.city}</Text>
              </>
            ) : (
              <Text className="text-gray-600">{t('No address selected')}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/(checkout)/checkoutAddress')}>
            <Text className="text-red-500 font-semibold">{t('Change')}</Text>
          </TouchableOpacity>
        </View>

        {/* Payment */}
        <Text className="text-lg font-bold mb-2">{t('Payment')}</Text>
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
              {selectedPaymentMethod ? selectedPaymentMethod : t('No method selected')}
            </Text>
          </View>

          <TouchableOpacity onPress={() => router.push('/(card)/Card')}>
            <Text className="text-red-500 font-semibold">{t('Change')}</Text>
          </TouchableOpacity>
        </View>

        {/* Order summary */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-base text-gray-600">{t('Order')}:</Text>
            <Text className="text-base font-semibold">
              {totalPrice.toLocaleString("vi-VN")} VND
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">{t('Summary')}:</Text>
            <Text className="text-lg font-bold">
              {summary.toLocaleString("vi-VN")} VND
            </Text>
          </View>
        </View>

        {/* Submit Order */}
        <View className="mt-8 mb-12">
          <TouchableOpacity
            onPress={async () => {
              handleCheckout();
              await fetchCartItems();
              await loadAllStocks([]);
              
            }}
            className="bg-red-500 p-4 rounded-xl"
          >
            <Text className="text-white text-center text-lg font-bold">
              {t('Submit order')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

  );
};

export default Checkout;
