import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const SuccessScreen = () => {
//   const confettiRef = useRef(null);
//   const navigation = useNavigation();

  return (
    <View className="flex-1 bg-yellow-400 items-center justify-center px-5">
      {/* Confetti Effect */}
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={true}
        fadeOut={true}
        fallSpeed={3000}
        explosionSpeed={300}
      /> 

      <Image
        source={require('../../assets/images/OrderSuccess/success.jpg')}
        className="w-[250px] h-[300px] mb-8 rounded-2xl"
        resizeMode="cover"
      />

      <Text className="text-3xl font-bold text-black mb-2">Success!</Text>
      <Text className="text-base text-gray-800 text-center mb-8">
        Your order will be delivered soon.{"\n"}Thank you for choosing our app!
      </Text>

      <TouchableOpacity
        className="bg-red-600 py-3 px-6 rounded-full"
        onPress={() => router.push('/(tabs)/home')}
      >
        <Text className="text-white text-base">Continue shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;
