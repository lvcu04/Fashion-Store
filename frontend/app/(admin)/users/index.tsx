import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useAuth } from '@/context/authContext';
import { API } from '@/constants/api';


type User = {
  uid: string;
  name:string;
  email: string;
}



const fakeUsers = [
  {
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];

const mapFakeUsers = fakeUsers.map((user) => ({
  avatar: user.avatar,
}))

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const {firebaseUser} = useAuth();
  const fetchUsers = async () => {
    if(!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(API.user.all, {
        headers: {
           "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setUsers(data);
      
    } catch (error) {
      console.error("bắt error",error);
    }
  }
useEffect(() => {
  fetchUsers();
}, []);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-6 pb-2 rounded-b-3xl shadow-md mb-2">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#4B5563" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">
            Quản lý người dùng
          </Text>
        </View>
      </View>
      <ScrollView className="flex-1 px-4">
        {users.map((user) => (
          <View
            key={user.uid}
            className="bg-white rounded-2xl p-4 mb-4 shadow-md flex-row items-center border border-gray-100"
          >
            <Image
              source={{ uri: fakeUsers[0].avatar }}
              className="w-14 h-14 rounded-full mr-4 border border-gray-200"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="font-semibold text-lg text-gray-900 mb-1">
                {user.name}
              </Text>
              <Text className="text-gray-500 text-xs">{user.email}</Text>
            </View>
            <View className="flex-row ml-2">
              <TouchableOpacity className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                <Ionicons name="create-outline" size={18} color="#2563eb" />
              </TouchableOpacity>
              <TouchableOpacity className="w-8 h-8 rounded-full bg-red-100 items-center justify-center">
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
