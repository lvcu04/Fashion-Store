import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

type Product = {
  product_id: string;
  image: string;
  productName: string;
  price: number;
  category_id: string;
};

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const router = useRouter();

  const screenWidth = Dimensions.get('window').width;
  const scrollViewPaddingHorizontal = 40; // Tổng px-5 trái + phải = 20 + 20
  const spacing = 12;
  const numColumns = 3;

  const itemWidth =
    (screenWidth - scrollViewPaddingHorizontal - spacing * (numColumns - 1)) / numColumns;

  return (
    <View className="flex-row flex-wrap mt-4">
      {products.map((product, index) => (
        <TouchableOpacity
          key={product.product_id}
          onPress={() => router.push(`/productDetails/${product.product_id}`)}
          className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md mb-3"
          style={{
            width: itemWidth,
            marginRight: (index + 1) % numColumns === 0 ? 0 : spacing,
            marginLeft: index % numColumns === 0 ? 0 : 0,
            elevation: 3,
          }}
        >
          <Image
            source={{ uri: product.image }}
            className="w-full h-28"
            resizeMode="cover"
          />

          <View className="p-2 items-center">
            <Text
              className="font-bold text-xs text-gray-900 uppercase"
              numberOfLines={1}
            >
              {typeof product.productName === 'string'
                ? product.productName
                : 'Unknown'}
            </Text>
            <Text
              className="text-gray-900 text-xs font-semibold mt-1"
              numberOfLines={1}
            >
              {product.price.toLocaleString('vi-VN')} VNĐ
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Products;
