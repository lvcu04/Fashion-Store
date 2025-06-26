import { View, Text, TouchableOpacity, Image } from 'react-native';
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
  
};


const Products: React.FC<ProductsProps> = ({ products }) => {
  const router = useRouter();


  return (
    <View className="flex-row flex-wrap gap-3 px-2">
  {products.map((product) => (
    <TouchableOpacity
      key={product.product_id}
      onPress={() => router.push(`/productDetails/${product.product_id}`)}
      className="bg-white w-[31.1%] rounded-xl overflow-hidden border border-gray-200 shadow-md"
      style={{ elevation: 3 }}
    >
      {/* Ảnh sản phẩm */}
      <Image
        source={{ uri: product.image }}
        className="w-full h-32"
        resizeMode="cover" 
      />

      {/* Thông tin sản phẩm */}
      <View className="p-3 items-center">
        <Text
          className="font-bold text-sm text-gray-900 uppercase"
          numberOfLines={1}
        >
          {typeof product.productName === 'string'
            ? product.productName
            : 'Unknown Product'}
        </Text>
        <Text
          className="text-gray-900 text-sm font-semibold mt-1"
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
