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
  const { favourites, addFavourite,  removeFavourite } = useFavourites(); 

  const toggleFavourite = (product: Product) => {
    const isFavourite = favourites.some(item => item.id === product.id);
    if (isFavourite) {
      removeFavourite(Number(product.id));
    } else {
       addFavourite({ ...product, id: Number(product.id) });
    }
  };

  return (
    <View className="flex-row flex-wrap justify-between">
      {products.map((product) => {
        return (
          <TouchableOpacity
            key={product.id}
            className="bg-white rounded-2xl shadow p-0 mb-4 w-[48%] overflow-hidden relative"
            onPress={() => {
              router.push({
                pathname: '/productDetails/[id]',
                params: { id: product.id },
              });
            }}
          >
            <Image
              source={{ uri: product.image }}
              className="w-full h-32 rounded-lg mb-2"
              resizeMode="cover"
            />
            <View className="flex-row justify-between items-center ">
              <Text className="font-bold text-base w-[85%]" numberOfLines={1}>{product.title}</Text>
              <TouchableOpacity
            onPress={() => toggleFavourite(product)}
            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/80 items-center justify-center"
          >
            <MaterialIcons
              name={favourites.some(item => item.id === product.id) ? 'favorite' : 'favorite-border'}
              size={18}
              color="white"
            />
          </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-sm">${product.price}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Products;
