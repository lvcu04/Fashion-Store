import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useFavourites } from '@/context/favouriteContext';

type Product = {
  id: string | number;
  image: string;
  title: string;
  price: number;
};

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const router = useRouter();
  const { favourites, addFavourite, removeFavourite } = useFavourites();

  const toggleFavourite = (product: Product) => {
    const isFavourite = favourites.some(item => item.id === product.id);
    if (isFavourite) {
      removeFavourite(Number(product.id));
    } else {
      addFavourite({ ...product, id: Number(product.id) });
    }
  };

  return (
    <View className="flex-row flex-wrap justify-between px-1">
      {products.map((product) => (
        <TouchableOpacity
          key={product.id}
          className="bg-white rounded-xl shadow-md mb-4 w-[48%] overflow-hidden border border-gray-200"
          style={{ elevation: 3 }}
          onPress={() => {
            router.push({
              pathname: '/productDetails/[id]',
              params: { id: product.id },
            });
          }}
        >
          <View className="relative">
            <Image
              source={{ uri: product.image }}
              className="w-full h-28 rounded-t-xl"
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => toggleFavourite(product)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 items-center justify-center"
            >
              <MaterialIcons
                name={favourites.some(item => item.id === product.id) ? 'favorite' : 'favorite-border'}
                size={18}
                color={favourites.some(item => item.id === product.id) ? '#FF0000' : '#fff'}
              />
            </TouchableOpacity>
          </View>
          <View className="p-3 items-center">
            {/* Ensure title is a string and wrapped in Text */}
            <Text className="font-bold text-sm text-gray-900 uppercase" numberOfLines={1}>
              {typeof product.title === 'string' ? product.title : 'Unknown Product'}
            </Text>
            {/* Ensure price is properly formatted and wrapped in Text */}
            <Text className="text-gray-900 text-sm font-semibold mt-1">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Products;