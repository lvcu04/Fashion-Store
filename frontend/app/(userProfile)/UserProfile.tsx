// screens/UserProfile.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/context/authContext";
import { useTranslation } from 'react-i18next';
import { API } from "@/constants/api";



const UserProfile = () => {
  const router = useRouter();
  const { userProfile , firebaseUser } = useAuth();
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [selectedLanguage, setSelectedLanguage] = React.useState("English");
  const [showChangePass, setShowChangePass] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
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

  const maskHalf = (value : string) => {
    if (!value) return '';
    const length = value.length;
    const visibleLength = Math.floor(length / 2);
    const hidden = '*'.repeat(length - visibleLength);
    return value.slice(0,visibleLength) + hidden;
  }

  const handleChangePassword = async () => {
      try {
        const token = await firebaseUser?.getIdToken();

        const res = await fetch(API.user.changePass, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Đổi mật khẩu thất bại');

        Alert.alert('Thành công', 'Đã đổi mật khẩu');
        setShowChangePass(false);
        setNewPassword('');
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        Alert.alert('Lỗi', message);
      }
    };


  return (
   <>
    <ScrollView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View className="bg-white pt-12 pb-4 px-5 flex-row items-center">
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
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
        <View className="space-y-4 ">
          <View className="bg-white rounded-2xl p-3 shadow-md border border-gray-50 mb-3">
            <Text className="text-sm text-gray-600">{t('Full Name')}</Text>
            <Text className="text-xl font-bold text-gray-900">{userProfile.name || "..."}</Text>
          </View>

          
          <View className="bg-white rounded-2xl p-3 shadow-md border border-gray-50 mb-3">
            <Text className="text-sm text-gray-600 mb-2">Email</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity>
                <Text>
                 {maskHalf(userProfile.email)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="bg-white rounded-2xl p-3 shadow-md border border-gray-50 mb-3">
            <Text className="text-sm text-gray-600 mb-2">Phone</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity>
                <Text>
                 {maskHalf(userProfile.phone)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="bg-white rounded-2xl p-3 shadow-md border border-gray-50 mb-3">
            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={() => setShowChangePass(true)}>
                <Text className="text-blue-500 font-medium">Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Language Modal */}
      
    </ScrollView>
    {showChangePass && (
      <Modal
        visible={showChangePass}
        animationType="slide"
        transparent
        onRequestClose={() => setShowChangePass(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowChangePass(false)}>
          <View className="flex-1 justify-center items-center bg-black/40">
            <TouchableWithoutFeedback>
              <View className="bg-white w-[90%] rounded-2xl p-5">
                <Text className="text-lg font-bold mb-3">Change Password</Text>
                <TextInput
                  placeholder="New Password"
                  secureTextEntry
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  className="bg-blue-500 py-2 rounded-lg"
                  onPress={handleChangePassword}
                >
                  <Text className="text-white text-center">Confirm</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )}
    </>
  );
};

export default UserProfile;
