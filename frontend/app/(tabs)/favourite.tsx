import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'FAVOURITES_LIST';

const Favourite = () => {
  const router = useRouter();
  const [favourites, setFavourites] = useState<any[]>([]);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 150, easing: Easing.ease }) }],
      opacity: withTiming(opacity.value, { duration: 150, easing: Easing.ease }),
    };
  });

  const handlePressIn = () => {
    scale.value = 0.95;
    opacity.value = 0.85;
  };

  const handlePressOut = () => {
    scale.value = 1;
    opacity.value = 1;
  };

  const loadFavourites = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setFavourites(JSON.parse(data));
      }
    } catch (e) {
      console.log('Error loading favourites:', e);
    }
  };

  const removeFavourite = async (id: number) => {
    const newList = favourites.filter((item) => item.id !== id);
    setFavourites(newList);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.log('Error saving favourites:', e);
    }
  };

  useEffect(() => {
    loadFavourites();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/productDetails/[id]', params: { id: item.id } })}
      className="flex-row items-center p-4 bg-white rounded-2xl mb-4 shadow-lg"
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: 100, height: 100 }}
        className="rounded-xl"
        resizeMode="contain"
      />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-gray-900">
          {item.title.length > 10 ? item.title.slice(0, 10) + '...' : item.title}
        </Text>
        <View className="flex-row items-center mt-2">
          {[...Array(5)].map((_, index) => (
            <AntDesign
              key={index}
              name="star"
              size={16}
              color={index < Math.floor(item.rating?.rate ?? 0) ? '#facc15' : '#e5e7eb'}
            />
          ))}
          <Text className="text-xs ml-1 text-gray-500">({item.rating?.count ?? 0} Reviews)</Text>
        </View>
        <Text className="text-xl font-bold text-gray-800 mt-2">${item.price.toFixed(2)}</Text>
      </View>

      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => removeFavourite(item.id)}
          className="p-3 bg-red-500 rounded-full shadow-md"
        >
          <AntDesign name="close" size={12} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View className= 'flex-1 bg-gray-50 '>
      <View className="flex-row justify-between items-center px-5 pt-6 pb-4 bg-white shadow-sm">
        <Text className="text-3xl font-bold text-gray-900">Favourite</Text>
      </View>

      {favourites.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <AntDesign name="hearto" size={50} color="#d1d5db" />
          <Text className="text-lg font-semibold text-gray-500 mt-4">
            Your Favourite list is empty
          </Text>
          <Text className="text-sm text-gray-400 mt-2">
            Add Product to your favourite list to view here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}
        />
      )}
    </View>
  );
};

export default Favourite;
