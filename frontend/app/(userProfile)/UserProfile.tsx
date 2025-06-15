// screens/UserProfile.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/context/authContext";
import { useTranslation } from 'react-i18next';

const GENDERS = ["Male", "Female"];

const UserProfile = () => {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [selectedLanguage, setSelectedLanguage] = React.useState("English");
  const [gender, setGender] = React.useState("Male");
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(false);

  const renderLanguageItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedLanguage(item);
        setLanguageModalVisible(false);
      }}
      className="p-4 border-b border-gray-200"
    >
      <Text className="text-lg text-gray-800">{item}</Text>
    </TouchableOpacity>
  );

  return (

    <ScrollView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View className="bg-white pt-12 pb-4 px-5 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-black ml-4">{t('User Profile')}</Text>
      </View>

      <View className="rounded-b-3xl pt-4 pb-8 px-5 bg-white">
        {/* Avatar */}
        <View className="items-center mb-6">
          <View className="relative">
            <View className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg overflow-hidden">
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-white w-10 h-10 rounded-full items-center justify-center shadow-md border-2 border-gray-200">
              <Ionicons name="camera" size={20} color="#6366f1" />
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-600 mt-3 font-medium">Tap to change photo</Text>
        </View>

        {/* Info Boxes */}
        <View className="space-y-4">
          <View className="bg-white rounded-2xl p-3 shadow-md border border-gray-200">
            <Text className="text-sm text-gray-600">{t('Full Name')}</Text>
            <Text className="text-xl font-bold text-gray-900">{userProfile.name || "..."}</Text>
          </View>

          {/* Gender Switcher */}
          <View className="bg-white rounded-2xl p-3 shadow-md border border-gray-200">
            <Text className="text-sm text-gray-600 mb-2">Gender</Text>
            <View className="flex-row space-x-3">
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  className={`flex-1 px-3 py-2 rounded-lg border ${
                    gender === g ? "bg-indigo-100 border-indigo-400" : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <Text className="text-center text-gray-700 font-medium">{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

         
        </View>
      </View>

      {/* Language Modal */}
      
    </ScrollView>

  );
};

export default UserProfile;
