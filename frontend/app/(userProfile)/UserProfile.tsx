import React from "react";
import { useAuth } from "@/context/authContext";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
} from "react-native";

import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

type SettingItemProps = {
  icon: React.ReactNode;
  title: string;
  rightText?: string;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  iconBgColor?: string;
  onPress?: () => void;
  onSwitchToggle?: (value: boolean) => void;
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  rightText,
  showArrow = true,
  showSwitch = false,
  switchValue = false,
  iconBgColor = "bg-indigo-100",
  onPress,
  onSwitchToggle,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(scale.value, {
          duration: 200,
          easing: Easing.out(Easing.quad),
        }),
      },
    ],
    opacity: withTiming(opacity.value, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    }),
  }));

  const handlePress = (isIn: boolean) => {
    scale.value = isIn ? 0.96 : 1;
    opacity.value = isIn ? 0.9 : 1;
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPressIn={() => handlePress(true)}
        onPressOut={() => handlePress(false)}
        onPress={onPress}
        className="flex-row justify-between items-center p-4 bg-white rounded-xl shadow-md border border-gray-200"
      >
        <View className="flex-row items-center space-x-3">
          <View className={`${iconBgColor} p-2 rounded-lg`}>{icon}</View>
          <Text className="text-[16px] font-medium text-gray-800">{title}</Text>
        </View>
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchToggle}
            trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
            thumbColor="#ffffff"
            ios_backgroundColor="#e5e7eb"
          />
        ) : (
          <View className="flex-row items-center space-x-2">
            {rightText && (
              <Text className="text-sm font-medium text-gray-500">
                {rightText}
              </Text>
            )}
            {showArrow && (
              <Feather name="chevron-right" size={18} color="#c4b5fd" />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const UserProfile = () => {
  const { user } = useAuth();
  const logoutScale = useSharedValue(1);
  const logoutOpacity = useSharedValue(1);
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [gender, setGender] = React.useState("Male");

  const logoutAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(logoutScale.value, {
          duration: 200,
          easing: Easing.out(Easing.quad),
        }),
      },
    ],
    opacity: withTiming(logoutOpacity.value, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    }),
  }));

  const handleLogoutPress = (isIn: boolean) => {
    logoutScale.value = isIn ? 0.95 : 1;
    logoutOpacity.value = isIn ? 0.8 : 1;
  };

  return (
    <ScrollView className="flex-1 bg-transparent">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View className="rounded-b-3xl pt-12 pb-8 px-5 shadow-lg bg-white">
        <View className="items-center mb-6">
          <View className="relative">
            <View className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg overflow-hidden">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-white w-10 h-10 rounded-full items-center justify-center shadow-md border-2 border-gray-200">
              <Ionicons name="camera" size={20} color="#6366f1" />
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-600 mt-3 font-medium">
            Tap to change photo
          </Text>
        </View>
        <View className="space-y-6">
          <View className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <Text className="text-sm text-gray-600 font-medium">Full Name</Text>
            <Text className="text-xl font-bold text-gray-900">
              {user?.displayName || "Fscreation"}
            </Text>
          </View>
          <View className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <Text className="text-sm text-gray-600 font-medium mb-3">
              Gender
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setGender("Male")}
                className={`flex-row items-center space-x-2 px-4 py-2 rounded-lg flex-1 mr-2 ${
                  gender === "Male" ? "bg-gray-100" : "bg-white"
                } border border-gray-200`}
              >
                <View
                  className={`w-5 h-5 rounded-full ${
                    gender === "Male" ? "bg-white" : "border-2 border-gray-300"
                  }`}
                >
                  {gender === "Male" && (
                    <View className="w-3 h-3 rounded-full bg-indigo-600 m-auto" />
                  )}
                </View>
                <Text
                  className={`text-[15px] font-medium ${
                    gender === "Male" ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender("Female")}
                className={`flex-row items-center space-x-2 px-4 py-2 rounded-lg flex-1 ml-2 ${
                  gender === "Female" ? "bg-gray-100" : "bg-white"
                } border border-gray-200`}
              >
                <View
                  className={`w-5 h-5 rounded-full ${
                    gender === "Female"
                      ? "bg-white"
                      : "border-2 border-gray-300"
                  }`}
                >
                  {gender === "Female" && (
                    <View className="w-3 h-3 rounded-full bg-indigo-600 m-auto" />
                  )}
                </View>
                <Text
                  className={`text-[15px] font-medium ${
                    gender === "Female" ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-row space-x-4">
            <View className="bg-white rounded-xl p-4 shadow-md border border-gray-200 flex-1">
              <Text className="text-sm text-gray-600 font-medium">Age</Text>
              <Text className="text-lg font-bold text-gray-900">22 Years</Text>
            </View>
            <View className="bg-white rounded-xl p-4 shadow-md border border-gray-200 flex-1">
              <Text className="text-sm text-gray-600 font-medium">Email</Text>
              <Text
                className="text-lg font-bold text-gray-900"
                numberOfLines={1}
              >
                Fscreation441@gmail.com
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="mt-8 px-5">
        <View className="flex-row items-center mb-5">
          <Ionicons name="settings-outline" size={22} color="#6366f1" />
          <Text className="text-xl font-bold text-gray-900 ml-2">Settings</Text>
        </View>
        <View className="space-y-6">
          {[
            {
              icon: (
                <Ionicons name="language-outline" size={22} color="#6366f1" />
              ),
              title: "Language",
              rightText: "English",
              iconBgColor: "bg-indigo-100",
            },
            {
              icon: (
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#10b981"
                />
              ),
              title: "Push Notifications",
              showSwitch: true,
              switchValue: notifications,
              showArrow: false,
              iconBgColor: "bg-emerald-100",
              onSwitchToggle: (value: boolean) => setNotifications(value),
            },
            {
              icon: <Ionicons name="moon-outline" size={22} color="#a855f7" />,
              title: "Dark Mode",
              showSwitch: true,
              switchValue: darkMode,
              showArrow: false,
              iconBgColor: "bg-purple-100",
              onSwitchToggle: (value: boolean) => setDarkMode(value),
            },
            {
              icon: (
                <Ionicons
                  name="help-circle-outline"
                  size={22}
                  color="#06b6d4"
                />
              ),
              title: "Help & Support",
              iconBgColor: "bg-cyan-100",
            },
            {
              icon: (
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#f59e0b"
                />
              ),
              title: "Privacy",
              iconBgColor: "bg-amber-100",
            },
          ].map((item, index) => (
            <SettingItem key={index} {...item} />
          ))}
        </View>
        <Animated.View style={logoutAnimatedStyle} className="mt-8 mb-8">
          <TouchableOpacity
            onPressIn={() => handleLogoutPress(true)}
            onPressOut={() => handleLogoutPress(false)}
            className="bg-red-500 rounded-xl py-4 px-6 flex-row items-center justify-center shadow-md border border-red-600"
          >
            <AntDesign name="logout" size={20} color="white" />
            <Text className="text-white font-semibold text-[16px] ml-2">
              Log Out
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
