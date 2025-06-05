import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFavourites } from '@/context/favouriteContext';
import { API } from '@/constants/api';
import { useCart } from '@/context/cartContext';


type Product = {
  product_id: string;
  productName: string;
  image: string;
  title: string;
  price: number;
  category_id?: string;
};

const ProductDetailScreen = () => {
  const { id: product_id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const { addToCart, cart } = useCart();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { favourites, addFavourite, removeFavourite } = useFavourites();
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const toggleFavourite = (product: Product) => {
    const isFavourite = favourites.some(item => String(item.product_id) === String(product.product_id));
    if (isFavourite) {
      removeFavourite(product.product_id);
    } else {
      addFavourite({ ...product, product_id: product.product_id, category_id: product.category_id ?? '' });
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

  useEffect(() => {
    if (product_id) {
      fetchProductDetails(product_id);
    }
  }, [product_id]);

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

  const isFavourite = favourites.some(item => String(item.product_id) === String(data.id));
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <>
      <ScrollView className="flex-1 bg-slate-50">
        {/* Back & Wishlist */}
        <View className="flex-row justify-between items-center px-4 py-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
            toggleFavourite({
              product_id: data.id,
              productName: data.productName,
              image: data.image,
              title: data.productName,
              price: data.price,
            })
          }>
            <MaterialIcons
              name={isFavourite ? 'favorite' : 'favorite-border'}
              size={25}
              color={isFavourite ? 'red' : 'black'}
            />
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View className="p-5">
          <Image
            source={{ uri: data.image }}
            style={{ width: '100%', height: 320 }}
            className="bg-white my-4"
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View className="px-5 py-5 rounded-t-3xl bg-white">
          <Text className="text-2xl font-bold">{data.productName}</Text>

          {/* Rating, Reviews & Status */}
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-center">
              {[...Array(5)].map((_, index) => (
                <AntDesign
                  key={index}
                  name="star"
                  size={14}
                  color={index < Math.floor(data.ranking ?? 0) ? '#facc15' : '#d1d5db'}
                />
              ))}
              <Text className="text-xs ml-1">({data.reviews ?? 0} Reviews)</Text>
            </View>
            <Text className={`font-semibold ${data.status === 'Stock' ? 'text-green-600' : 'text-red-500'}`}>
              {data.status}
            </Text>
          </View>

          {/* Size */}
          <Text className="font-bold text-lg mt-4">Size</Text>
          <View className="flex-row flex-wrap mt-2">
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                className={` rounded-full px-4 py-2 m-1 ${selectedSize === size ? 'bg-black' : 'bg-gray-200'}`}
                onPress={() => setSelectedSize(size)}
              >
                <Text className={`${selectedSize === size  ? 'text-white' : ''} text-base font-medium`}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

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
            <Text className="text-2xl font-bold"> {data.price.toLocaleString("vi-VN")}VNĐ</Text>
          </View>

          {/* Additional Info */}
          <View className="my-6">
            <Text className="text-lg font-semibold mb-3">Additional Information</Text>
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
              <Text className="text-gray-600">Quantity</Text>
              <Text className="font-medium">{data.quantity}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="flex-row items-center px-4 py-4 border-t border-gray-200">
        <TouchableOpacity className="flex-1 bg-black rounded-full py-4 mr-3"
        onPress={() => {
         const item = {
          product_id: product_id,
          productName: data.productName,
          image: data.image,
          price: data.price,
          quantity: quantity,
        };

        addToCart(item);
        
        }}>
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

