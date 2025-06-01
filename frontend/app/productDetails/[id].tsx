import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFavourites } from '@/context/favouriteContext';
import { API } from '@/constants/api';

type Product = {
  product_id: string ;
  image: string;
  title: string;
  price: number;
};

const ProductDetailScreen = () => {
  const { id : productId } = useLocalSearchParams<{ id: string }>();
  console.log('Product ID:', productId);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { favourites, addFavourite, removeFavourite } = useFavourites();

  const toggleFavourite = (product: Product) => {
    const isFavourite = favourites.some(item => String(item.id) === String(product.product_id));
    if (isFavourite) {
      removeFavourite(product.product_id);
    } else {
      addFavourite({ ...product, id: product.product_id });
    }
  };

  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch(API.product.getById(productId));
      const productData = await response.json();
      setData(productData);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('Product Data:', data);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

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

  const isFavourite = favourites.some(item => item.id === data.id);

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        {/* Back & Wishlist */}
        <View className="flex-row justify-between items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
            toggleFavourite({
              product_id: data.id,
              image: data.image,
              title: data.productName,
              price: data.price,
            })
          }>
            <MaterialIcons
              name={isFavourite ? 'favorite' : 'favorite-border'}
              size={25}
              color="black"
            />
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View className="p-5">
          <Image
            source={{ uri: data.image }}
            style={{ width: '100%', height: 380 }}
            className="bg-white my-4"
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View className="px-5 py-5 rounded-t-3xl bg-white">
          <Text className="text-2xl font-bold">{data.productName}</Text>

          {/* Status */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-green-600 font-semibold">{data.status}</Text>
            <Text className="text-gray-600">Quantity: {data.quantity}</Text>
          </View>

          {/* Size */}
          <Text className="font-bold text-lg mt-4">Size</Text>
          <Text className="text-base text-gray-800 mt-1">{data.size}</Text>

          {/* Description */}
          <Text className="font-bold text-lg mt-4">Description</Text>
          <Text className="text-gray-600 mt-2">{data.description}</Text>

          {/* Quantity Selector & Price */}
          <View className="flex-row justify-between items-center mt-6">
            <View className="flex-row items-center bg-gray-200 rounded-lg">
              <TouchableOpacity
                onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="px-3 py-2"
              >
                <Text className="text-xl">-</Text>
              </TouchableOpacity>
              <Text className="px-4 py-2 text-lg">{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="px-3 py-2"
              >
                <Text className="text-xl">+</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold">
              {data.price}đ
            </Text>
          </View>

          {/* Additional Information */}
          <View className="my-6">
            <Text className="text-lg font-semibold mb-3">
              Additional Information
            </Text>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Category</Text>
              <Text className="font-medium capitalize">{data.category_id}</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Condition</Text>
              <Text className="font-medium">{data.condition}</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Location</Text>
              <Text className="font-medium">{data.location}</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Seller</Text>
              <Text className="font-medium">{data.sellerName}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="font-medium">Free</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="flex-row items-center px-4 py-4 border-t border-gray-200">
        <TouchableOpacity className="flex-1 bg-black rounded-full py-4 mr-3">
          <Text className="text-white text-center font-semibold">
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(cart)/Cart')}
          className="w-14 h-14 items-center justify-center rounded-full bg-gray-100"
        >
          <MaterialIcons name="shopping-cart" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProductDetailScreen;
