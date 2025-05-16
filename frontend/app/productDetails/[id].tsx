import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProductDetails = async (id: string) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const productData = await response.json();
      setData(productData);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Loading...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Product not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Nút Back */}
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/home')}
        className="flex-row items-center px-4 py-3"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text className="ml-2 text-lg font-medium">Back</Text>
      </TouchableOpacity>

      <View className="p-5 max-w-[560px]">
        <Image
          source={{ uri: data.image || 'https://via.placeholder.com/150' }}
          style={{ width: '100%', height: 380 }}
          className="bg-white my-4"
          resizeMode="contain"
        />
      </View>

      <View className="px-5 py-5 rounded-3xl bg-slate-100">
        <Text className="text-xl font-bold">{data.title}</Text>
        <Text className="text-lg font-semibold text-green-600">${data.price}</Text>
        <View className="flex-row items-center">
          <AntDesign name="star" size={14} color="#facc15" />
          <Text className="text-xs ml-1">
            {data.rating?.rate ?? 0} ({data.rating?.count ?? 0} đánh giá)
          </Text>
        </View>
        <Text className="font-bold py-2 text-xl">Description</Text>
        <Text className="text-gray-600">{data.description}</Text>
      </View>
    </View>
  );
};

export default ProductDetailScreen;
