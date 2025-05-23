import React from 'react';
import { View, Text, Image, TouchableOpacity, Switch, ScrollView, StatusBar } from 'react-native';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type SettingItemProps = {
  icon: React.ReactNode;
  title: string;
  rightText?: string;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  rightText,
  showArrow = true,
  showSwitch = false,
  switchValue = false,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 150, easing: Easing.ease }) }],
      opacity: withTiming(opacity.value, { duration: 150, easing: Easing.ease }),
    };
  });

  const handlePressIn = () => {
    scale.value = 0.98;
    opacity.value = 0.8;
  };

  const handlePressOut = () => {
    scale.value = 1;
    opacity.value = 1;
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="flex-row justify-between items-center py-4 border-b border-gray-200"
      >
        <View className="flex-row items-center space-x-4">
          <View className="bg-gray-100 p-2 rounded-lg">{icon}</View>
          <Text className="text-base font-semibold text-gray-800">{title}</Text>
        </View>
        {showSwitch ? (
          <Switch value={switchValue} trackColor={{ false: '#ccc', true: '#1D4ED8' }} thumbColor="#fff" />
        ) : (
          <View className="flex-row items-center space-x-1">
            {rightText && <Text className="text-gray-500">{rightText}</Text>}
            {showArrow && <Feather name="chevron-right" size={20} color="#9ca3af" />}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const UserProfile = () => {
  const logoutScale = useSharedValue(1);
  const logoutOpacity = useSharedValue(1);

  const logoutAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(logoutScale.value, { duration: 200, easing: Easing.ease }) }],
      opacity: withTiming(logoutOpacity.value, { duration: 200, easing: Easing.ease }),
    };
  });

  const handleLogoutPressIn = () => {
    logoutScale.value = 0.96;
    logoutOpacity.value = 0.7;
  };

  const handleLogoutPressOut = () => {
    logoutScale.value = 1;
    logoutOpacity.value = 1;
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View className="bg-white rounded-b-3xl p-6 shadow-md">
        <View className="items-center mb-6">
          <View className="relative">
            <View className="w-28 h-28 rounded-full border-4 border-white shadow-md">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' }}
                className="w-full h-full rounded-full"
              />
            </View>
            <TouchableOpacity className="absolute -bottom-2 -right-2 bg-blue-500 w-10 h-10 rounded-full items-center justify-center shadow-lg border-4 border-white">
              <Feather name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-500 mt-2">Upload Image</Text>
        </View>

        {/* User Info */}
        <View className="space-y-4">
          <View>
            <Text className="text-sm text-gray-500">Name</Text>
            <Text className="text-lg font-bold text-gray-900">Fscreation</Text>
          </View>

          <View>
            <Text className="text-sm text-gray-500 mb-1">Gender</Text>
            <View className="flex-row items-center space-x-6">
              <View className="flex-row items-center">
                <View className="w-4 h-4 rounded-full bg-black items-center justify-center mr-2">
                  <View className="w-2 h-2 rounded-full bg-white" />
                </View>
                <Text className="text-sm font-semibold text-gray-800">Male</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-4 h-4 rounded-full border border-gray-400 mr-2" />
                <Text className="text-sm text-gray-500">Female</Text>
              </View>
            </View>
          </View>

          <View>
            <Text className="text-sm text-gray-500">Age</Text>
            <Text className="text-lg font-bold text-gray-900">22 Year</Text>
          </View>

          <View>
            <Text className="text-sm text-gray-500">Email</Text>
            <Text className="text-lg font-bold text-gray-900">Fscreation441@gmail.com</Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View className="mt-6 px-10">
        <Text className="text-xl font-bold text-gray-900 mb-4">Settings</Text>

        <View className="bg-white rounded-2xl p-2 shadow space-y-1">
          <SettingItem
            icon={<MaterialIcons name="language" size={22} color="#6b7280" />}
            title="Language"
            rightText="English"
          />
          <SettingItem
            icon={<MaterialIcons name="notifications" size={22} color="#6b7280" />}
            title="Notification"
            showSwitch={true}
            switchValue={true}
            showArrow={false}
          />
          <SettingItem
            icon={<Feather name="moon" size={22} color="#6b7280" />}
            title="Dark Mode"
            rightText="Off"
            showSwitch={true}
            switchValue={true}
            showArrow={false}
          />
          <SettingItem
            icon={<AntDesign name="questioncircleo" size={22} color="#6b7280" />}
            title="Help Center"
          />
        </View>

        {/* Log Out Button */}
        <View className="mt-6">
          <Animated.View style={logoutAnimatedStyle}>
            <TouchableOpacity
              onPressIn={handleLogoutPressIn}
              onPressOut={handleLogoutPressOut}
              className="bg-red-500 rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-lg"
            >
              <AntDesign name="logout" size={22} color="white" />
              <Text className="text-white font-bold text-lg ml-3">Log Out</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Bottom Space */}
      <View className="h-10" />
    </ScrollView>
  );
};

export default UserProfile;