
import { ScrollView, Text, TextInput, View, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { addToFavourites } from '@/utils/favouriteStorage';
import Slider from '@/components/Home/Slider';
import Categories from '@/components/Home/Categories';
import Products from '@/components/Home/Products';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/constants/api';
type Product = {
  id: string;
  productName: string;
  price: number;
  image: string;
};

interface Category {
  id: number;
  categoryName: string;
}

export default function HomeScreen() {
  const [textSearch, setTextSearch] = useState('');
  const { firebaseUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favourites, setFavourites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);



  const handleAddFavourite = async (item: Product) => {
    await addToFavourites(item);
    await loadFavourites();
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API.product.all);
      const data = await response.json();
      console.log('Fetched products:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  


    
  const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.217.1:5000/api/category/allCategory');
        const data = await response.json();

        console.log('Fetched categories:', data);
        

        const formattedCategories: Category[] = data.map((category: any, index: number): Category => ({
          id: index + 1,
          categoryName: category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1),
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

 

  const loadFavourites = async () => {
    const data = await AsyncStorage.getItem('FAVOURITES_LIST');
    if (data) {
      setFavourites(JSON.parse(data));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    loadFavourites();

  }, []);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#ff0000" />
      </View>
    );

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-5">
          <Image
            source={{ uri: firebaseUser?.photoURL || 'https://i.pravatar.cc/100' }}
            className="w-[40px] h-[40px] rounded-full"
          />
          <FontAwesome name="bell-o" size={22} color="black" />
        </View>

        {/* Welcome */}
        <View className="mb-5">
          <Text className="font-bold text-3xl">Welcome,</Text>
          <Text className="text-xl text-gray-500">Our Fashions App</Text>
        </View>

        {/* Search */}
        <View className="flex flex-row mb-6 items-center justify-around">
          <TextInput
            className="w-3/4 bg-gray-100 p-3 rounded-full border border-gray-300"
            placeholder="Search for products..."
            value={textSearch}
            onChangeText={setTextSearch}
          />
          <View className="bg-gray-100 p-3 rounded-full ml-2">
            <Ionicons name="search" size={20} color="black" />
          </View>
        </View>

        {/* Slider */}
        <View className="mb-6">
          <Text className="font-bold text-lg mb-2">#Special for you</Text>
          <Slider />
        </View>

        {/* Categories */}
        <View className="mb-4">
          <Text className="font-bold text-lg">Categories</Text>
          <Categories categories={categories} />
        </View>

        {/* Top T-Shirt */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold text-lg">Top T-Shirt</Text>
          <Text className="text-gray-500 text-sm">View all</Text>
        </View>

        {/* Product List */}
        <Products products={products} onAddFavourite={handleAddFavourite} favourites={favourites} />
      </ScrollView>
    </View>
  );
}
