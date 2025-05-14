import { View, Text, TouchableOpacity,Image,ScrollView } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons';
const Profile = () => {
  const { logout,user } = useAuth();

  const router = useRouter()
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const profileOptions = [
    { label: 'Personal Details', icon: 'user' },
    { label: 'My Order', icon: 'shopping-bag' },
    { label: 'My Favourites', icon: 'heart' },
    { label: 'Shipping Address', icon: 'truck' },
    { label: 'My Card', icon: 'credit-card' },
    { label: 'Settings', icon: 'cog' },
  ];

  const policyOptions = [
    { label: 'FAQs', icon: 'question-circle' },
    { label: 'Privacy Policy', icon: 'shield' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Avatar & User Info */}
      <View className="bg-white rounded-2xl shadow p-4 items-center mb-6">
        <Image
          source={{ uri: user?.photoURL || 'https://i.pravatar.cc/100' }}
          className="w-20 h-20 rounded-full mb-2"
        />
        <Text className="text-lg font-semibold">{user?.displayName || 'User Name'}</Text>
        <Text className="text-gray-500">{user?.email || 'email@example.com'}</Text>
      </View>

      {/* Main options */}
      <View className="bg-white rounded-2xl mb-6 shadow">
        {profileOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
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
        style={{
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text className="text-white font-semibold text-base">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile