import { MaterialIcons ,Ionicons,AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFavourites } from '@/context/favouriteContext'; 


type Product = {
  id: string | number;
  image: string;
  title: string;
  price: number;
};

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('S'); 
  const { favourites, addFavourite,  removeFavourite } = useFavourites();


  const toggleFavourite = (product : Product) => {

    const isFavourite = favourites.some(item => item.id === product.id)
    if(isFavourite){
      removeFavourite(Number(product.id));
    }
    else{
      addFavourite({...product, id : Number(product.id)})
    }
  }
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

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Determine if the current product is a favourite
  const isFavourite = favourites.some(item => item.id === Number(data.id));

  return (
      <>
    <ScrollView className="flex-1 bg-white">
      {/* Nút Back và Wishlist */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFavourite({
          id: data.id,
          image: data.image,
          title: data.title,
          price: data.price,
        })}>
          <MaterialIcons
            name={isFavourite ? 'favorite' : 'favorite-border'}
            size={25}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Hình ảnh sản phẩm */}
      <View className="p-5">
        <Image
          source={{ uri: data.image || 'https://via.placeholder.com/150' }}
          style={{ width: '100%', height: 380 }}
          className="bg-white my-4"
          resizeMode="contain"
        />
      </View>

      {/* Thông tin sản phẩm */}
      <View className="px-5 py-5 rounded-t-3xl bg-white">
        {/* Tên sản phẩm */}
        <Text className="text-2xl font-bold">{data.title}</Text>

        {/* Đánh giá và trạng thái */}
        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row items-center">
            {[...Array(5)].map((_, index) => (
              <AntDesign
                key={index}
                name="star"
                size={14}
                color={index < Math.floor(data.rating?.rate ?? 0) ? '#facc15' : '#d1d5db'}
              />
            ))}
            <Text className="text-xs ml-1">
              ({data.rating?.count ?? 0} Reviews)
            </Text>
          </View>
          <Text className="text-green-600 font-semibold">AVAILABLE IN STOCK</Text>
        </View>

        {/* Kích thước */}
        <Text className="font-bold text-lg mt-4">Size</Text>
        <View className="flex-row mt-2">
          {sizes.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => setSelectedSize(size)}
              className={`w-10 h-10 rounded-full border mr-2 flex items-center justify-center ${
                selectedSize === size ? 'bg-black' : 'bg-white'
              }`}
            >
              <Text
                className={`text-base font-medium ${
                  selectedSize === size ? 'text-white' : 'text-black'
                }`}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mô tả */}
        <Text className="font-bold text-lg mt-4">Description</Text>
        <Text className="text-gray-600 mt-2">{data.description}</Text>

        {/* Số lượng và giá */}
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
          <Text className="text-2xl font-bold">${data.price}</Text>
        </View>
        <View className="my-6 ">
            <Text className="text-lg font-semibold mb-3">
              Additional Information
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Category</Text>
              <Text className="font-medium capitalize">{data.category}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Instock</Text>
              <Text className="font-medium">
                {data.rating?.count}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="font-medium">Free</Text>
            </View>
          </View>

        {/* Nút Add to Cart */}
        
      </View>
    </ScrollView>
    <View className="flex-row items-center px-4 py-4 border-t border-gray-200">
        <TouchableOpacity className="flex-1 bg-black rounded-full py-4 mr-3">
          <Text className="text-white text-center font-semibold">
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(cart)/Cart')}
        className="w-14 h-14 items-center justify-center rounded-full bg-gray-100">
          <MaterialIcons name="shopping-cart" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProductDetailScreen;