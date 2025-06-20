
import { ScrollView, Text, TextInput, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Slider from '@/components/Home/Slider';
import Categories from '@/components/Home/Categories';
import Products from '@/components/Home/Products';
import {useRouter} from 'expo-router';
import { API } from '@/constants/api';
import { useTranslation } from 'react-i18next';

type Product = {
  product_id: string;
  productName: string;
  price: number;
  image: string;
  category_id: string;
};

interface Category {
  category_id: string;
  categoryName: string;
}

export default function HomeScreen() {
  const [textSearch, setTextSearch] = useState('');
  const { firebaseUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  const selectedCategory = categories.find(cat => cat.category_id === selectedCategoryId);


  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategoryId ? product.category_id === selectedCategoryId : true;
    const matchesSearch = product.productName.toLowerCase().includes(textSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      // cập nhật lại filteredProducts nếu bạn để lọc trong useState
    }, 300); // đợi 300ms

    return () => clearTimeout(delaySearch);
  }, [textSearch, selectedCategoryId, products]);

  
 


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API.product.all);
      const data = await response.json();
      
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  


    
  const fetchCategories = async () => {
  try {
    const response = await fetch(API.category.all);
    const data = await response.json();

    const formattedCategories: Category[] = data.map((category: any): Category => ({
      category_id: category.category_id,
      categoryName: category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1),
    }));

    // Thêm "All" vào đầu danh sách
    const allCategory: Category = { category_id: '', categoryName: 'All' };
    setCategories([allCategory, ...formattedCategories]);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

  useEffect(() => {
    fetchProducts();
    fetchCategories();
 

  }, []);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#ff0000" />
      </View>
    );

 return (
  <View className="flex-1 bg-white relative">
    <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-5">
        <Image
          source={{ uri: firebaseUser?.photoURL || 'https://i.pravatar.cc/100' }}
          className="w-10 h-10 rounded-full"
        />
        <FontAwesome name="bell-o" size={22} color="black" onPress={()=>{router.push("/(tabs)/notification")}} />
      </View>

      {/* Welcome */}
      <View className="mb-4">
        <Text className="font-bold text-3xl">{t('Welcome,')}</Text>
        <Text className="text-xl text-gray-500">{t('Our Fashions App')}</Text>
      </View>

      {/* Search */}
      <View className="flex-row mb-6 items-center justify-around relative z-10">
        <TextInput
          className="w-full bg-gray-100 p-2  rounded-full border border-gray-300"
          placeholder={t('Search for products...')}
          value={textSearch}
          onChangeText={setTextSearch}
        />
        
      </View>

      {/* Slider */}
      <View className="mb-6">
        <Text className="font-bold text-lg mb-2">{t('#Special for you')}</Text>
        <Slider />
      </View>

      {/* Categories */}
      <View className="mb-4">
        <Text className="font-bold text-lg">{t('Categories')}</Text>
        <Categories categories={categories} onCategorySelect={setSelectedCategoryId} />
      </View>

      {/* Top Products Header */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-bold text-lg">
          {selectedCategoryId === '' || selectedCategoryId === null
            ? t('Products')
            :  t(`categoryNames.${selectedCategory?.categoryName}`)}
        </Text>
        
      </View>

      {/* Product List */}
      <Products products={filteredProducts} />
    </ScrollView>

    {/* Absolute horizontal search results */}
    {textSearch.trim() !== '' && (
      <>
        {/* Overlay mờ nền */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setTextSearch('')}
          className="absolute  left-0 right-0 bottom-0 h-2/3 bg-black opacity-20 z-40"
        />
       
      
     {/* Kết quả tìm kiếm */}
      <View className="absolute top-[183px] w-full bg-white px-4 py-3 shadow-lg z-50">
        <Text className="font-semibold text-base mb-3">{t('Search Results')}</Text>

        {filteredProducts.length === 0 ? (
          <View className='w-full items-center justify-center'>
            <Text className="text-center text-gray-500 text-base">😕 {t('No products found')}</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.product_id}
                className="mr-4 w-[120px] items-center"
                onPress={() => {
                  router.push(`/productDetails/${product.product_id}`);
                  setTextSearch('');
                }}
              >
                <Image
                  source={{ uri: product.image }}
                  className="w-[100px] h-[100px] rounded-lg"
                />
                <Text className="text-center text-sm mt-1">{product.productName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      </>
    )}

  </View>
);
}


