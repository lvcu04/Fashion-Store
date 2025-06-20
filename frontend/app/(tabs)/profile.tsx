import { useAuth } from '@/context/authContext';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useCheckout } from '@/context/checkoutContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { logout, firebaseUser } = useAuth();
  const router = useRouter();
  const { resetCheckoutContext } = useCheckout();
  const { t } = useTranslation(); 

  const handleLogout = async () => {
    try {
      await logout();
      resetCheckoutContext();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  type RouteType =
    | '/(tabs)/Order'
    | '/(tabs)/favourite'
    | '/(userProfile)/UserProfile'
    | '/(cart)/Cart'
    | '/(card)/Card'
    | '/(settings)/settingItem'
    | string; 

  const profileOptions: {
    label: string;
    icon: string;
    route?: RouteType;
  }[] = [
    { label: t('Personal Details'), icon: 'user', route: '/(userProfile)/UserProfile' },
    { label: t('My Order'), icon: 'shopping-basket', route: '/(tabs)/Order' },
    { label: t('Shipping Address'), icon: 'truck',route:'/(checkout)/checkoutAddress' },
    { label: t('Settings'), icon: 'cogs', route: '/(settings)/settingItem' },
    { label: t('My Cart'), icon: 'shopping-cart', route: '/(cart)/Cart' },
  ];

  const policyOptions: {
    label: string;
    icon: string;
    route?: RouteType;
  }[] = [
    { label: t('FAQs'), icon: 'question-circle' },
    { label: t('Privacy Policy'), icon: 'shield' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Avatar & User Info */}
      <View className="bg-white rounded-2xl shadow p-4 items-center mb-6">
        <Image
          source={{ uri: firebaseUser?.photoURL || 'https://i.pravatar.cc/100' }}
          className="w-20 h-20 rounded-full mb-2"
        />
        <Text className="text-lg font-semibold">
          {firebaseUser?.displayName || t('User Name')}
        </Text>
        <Text className="text-gray-500">{firebaseUser?.email || 'email@example.com'}</Text>
      </View>

      {/* Main options */}
      <View className="bg-white rounded-2xl mb-6 shadow">
        {profileOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => item.route && router.push(item.route as any)}
            className="flex-row justify-between items-center px-4 py-5 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              <FontAwesome name={item.icon as any} size={20} color="black" />
              <Text className="ml-4 text-base">{item.label}</Text>
            </View>
            <FontAwesome name="angle-right" size={20} color="#888" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Policy section */}
      <View className="bg-white rounded-2xl mb-6 shadow">
        {policyOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => item.route && router.push(item.route as any)}
            className="flex-row justify-between items-center px-4 py-5 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              <FontAwesome name={item.icon as any} size={20} color="black" />
              <Text className="ml-4 text-base">{item.label}</Text>
            </View>
            <FontAwesome name="angle-right" size={20} color="#888" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout button */}
      <TouchableOpacity
        onPress={handleLogout}
        className="mb-7 bg-red-500 px-4 py-3 rounded-2xl items-center justify-center"
      >
        <View className="flex-row items-center justify-center space-x-2">
          <AntDesign name="logout" size={24} color="white" />
          <Text className="text-white font-semibold text-xl ml-2">
            {t('Logout')}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;
