import { ScrollView, Text, TextInput, View, Image, ActivityIndicator } from 'react-native';
import { useState,useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import Slider from '@/components/Home/Slider';
import Categories from '@/components/Home/Categories';
import Products from '@/components/Home/Products';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
 
};

export default function HomeScreen() {
  const [textSearch, setTextSearch] = useState('');
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/');
      const data = await response.json();
      // console.log(data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) 
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#ff0000" />
      </View>
    );

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
          <Slider/>
        </View>

        {/* Categories Section */}
        <View className="mb-4">
          <Text className="font-bold text-lg">Categories</Text>
          <Categories/>
        </View>

        {/* Top T-Shirt Section */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold text-lg">Top T-Shirt</Text>
          <Text className="text-gray-500 text-sm">View all</Text>
        </View>

        {/* Product List */}
        <Products products={products} />

        {/* Add product list here */}
      </ScrollView>
    </View>
  );
}
