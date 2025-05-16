import { View, Text, TouchableOpacity,Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
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
  return (
 
    <View className="flex-row flex-wrap justify-between">
        {products.map((product) => (
        <TouchableOpacity
            key={product.id}
            className="bg-gray-100 rounded-lg shadow p-4 mb-4 w-[48%]"
            onPress={() =>{
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
            <Text className="font-bold text-base">{product.title}</Text>
            <Text className="text-gray-500 text-sm">${product.price}</Text>
        </TouchableOpacity>
        ))}
    </View>
  )
}

export default Products