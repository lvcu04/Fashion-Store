import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size: string | number;
  color: string;
  image: string;
};

const MyCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
        title: 'Soludos Ibiza Classic Lace Sneakers',
        price: 120.00,
        quantity: 1,
        size: 42,
        color: '#d1d5db',
        image: 'https://via.placeholder.com/150/FF6F61/FFFFFF?text=Sneakers',
    },
    {
      id: '2',
        title: 'Beats Solo3 Wireless Kulak',
        price: 50.00,
        quantity: 1,
        size: 'M',
        color: '#000000',
        image: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=Headphone',
    },
    {
      id: '3',
        title: 'Leather Crossbody Bag',
        price: 89.50,
        quantity: 1,
        size: 'One Size',
        color: '#50C878',
        image: 'https://via.placeholder.com/150/50C878/FFFFFF?text=Bag',
    },
  ]);

 

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg flex-row items-center">
      <Image
        source={{ uri: item.image }}
        style={{ width: 80, height: 80 }}
        className="rounded-xl"
        resizeMode="contain"
      />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-gray-900">{item.title}</Text>
        <View className="flex-row mt-1">
          <Text className="text-sm text-gray-600">Quantity: {item.quantity}</Text>
          <Text className="text-sm text-gray-600 ml-4">Size: {item.size}</Text>
        </View>
        <View className="flex-row items-center mt-1">
          <Text className="text-sm text-gray-600">Color: </Text>
          <View
            style={{ backgroundColor: item.color }}
            className="w-5 h-5 rounded-full border border-gray-300"
          />
        </View>
        <Text className="text-xl font-bold text-gray-800 mt-2">
          ${item.price.toFixed(2)}
        </Text>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, -1)}
            className="bg-gray-200 rounded-full p-1"
          >
            <AntDesign name="minus" size={16} color="#374151" />
          </TouchableOpacity>
          <Text className="mx-3 text-lg text-gray-800">{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, 1)}
            className="bg-gray-200 rounded-full p-1"
          >
            <AntDesign name="plus" size={16} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} className="ml-2">
        <AntDesign name="delete" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header giữ nguyên từ My Order */}
      <View className="bg-white shadow-sm p-5">
        <Text className="text-3xl font-bold text-gray-900">My Cart</Text>
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <AntDesign name="shoppingcart" size={50} color="#d1d5db" />
          <Text className="text-xl font-semibold text-gray-500 mt-4">
            Your Cart is Empty
          </Text>
          <Text className="text-sm text-gray-400 mt-2">
            Start shopping to add items here!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
          />
          <View className="bg-white p-5 shadow-sm">
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg text-gray-600">
                Total ({cartItems.length} item{cartItems.length > 1 ? 's' : ''}):
              </Text>
              <Text className="text-2xl font-bold text-gray-900">
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center">
              <Text className="text-white font-semibold text-lg">Proceed to Checkout</Text>
              <AntDesign name="arrowright" size={20} color="white" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default MyCart;