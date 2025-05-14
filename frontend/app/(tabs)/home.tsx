import { ScrollView, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Swiper from 'react-native-swiper';
import { useAuth } from '@/context/authContext';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [textSearch, setTextSearch] = useState('');
  const { user } = useAuth();
  const categories = [
    {
      id: 1,
      name: 'T-Shirts',
     
    },
    {
      id: 2,
      name: 'Jackets',
      
    },
    {
      id: 3,
      name: 'Jeans',
     
    },
    {
      id: 4,
      name: 'Shoese',
     
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-5">
          <Image
            source={{ uri: user?.photoURL || 'https://i.pravatar.cc/100' }}
            className="w-[40px] h-[40px] rounded-full"
          />
          <FontAwesome name="bell-o" size={22} color="black" />
        </View>

        {/* Welcome Text */}
        <View className="mb-5">
          <Text className="font-bold text-3xl">Welcome,</Text>
          <Text className="text-xl text-gray-500">Our Fashions App</Text>
        </View>

        {/* Search Box */}
        <View className="flex flex-row mb-6 items-center">
          <TextInput
            className="w-full bg-gray-100 p-3 rounded-full border border-gray-300"
            placeholder="Search for products..."
            value={textSearch}
            onChangeText={setTextSearch}
          />
          <View className="bg-gray-100 p-3 rounded-full ml-2">
            <Ionicons name='search' size={20} color="black" className="" />
          </View>
        </View>

        {/* Slider */}
        <View className="mb-6">
          <Text className="font-bold text-lg mb-2">#Special for you</Text>
          <View style={{ height: 180, borderRadius: 10, overflow: 'hidden' }}>
            {/* Example Slider */}
            <Swiper
              autoplay={true}
              loop={true}
              dotColor="#90A4AE"
              activeDotColor="#13274F"
              paginationStyle={{ bottom: 10 }}
            >
              <View className="flex-1 justify-center items-center bg-gray-300">
                {/* {BannerData.map((item) => (
                  <Image
                    key={item.id}
                    source={item.image}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ))} */}
              </View>
            </Swiper>
          </View>
        </View>

        {/* Categories Section */}
        <View className="mb-4">
          <Text className="font-bold text-lg">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
            <TouchableOpacity className='flex-row'>
              {categories.map((category) => (
              <View
                key={category.id}
                className="bg-gray-100 p-3 rounded-full mr-3"
              >
                <Text className="text-gray-700">{category.name}</Text>
              </View>
            ))}
            </TouchableOpacity>
            
          </ScrollView>
        </View>

        {/* Top T-Shirt Section */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold text-lg">Top T-Shirt</Text>
          <Text className="text-gray-500 text-sm">View all</Text>
        </View>
        {/* Add product list here */}
      </ScrollView>
    </View>
  );
}
