import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

// Mock data - sau này sẽ thay bằng API call
export const mockProducts = [
  {
    id: "SP001",
    name: "Áo thun nam",
    price: 200000,
    category: "men's clothing",
    image:
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    stock: 50,
    status: "active",
    description: "Áo thun nam chất liệu cotton 100%",
  },
  {
    id: "SP002",
    name: "Quần jean nữ",
    price: 400000,
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    stock: 30,
    status: "active",
    description: "Quần jean nữ kiểu dáng slim fit",
  },
  {
    id: "SP003",
    name: "Nhẫn bạc",
    price: 1500000,
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    stock: 20,
    status: "active",
    description: "Nhẫn bạc nữ đính đá sang trọng",
  },
];
export const categories = [
    { id: "all", name: "Tất cả" },
    { id: "men's clothing", name: "Nam" },
    { id: "women's clothing", name: "Nữ" },
    { id: "jewelery", name: "Trang sức" },
    { id: "electronics", name: "Điện tử" },
  ];
export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-6 pb-2 rounded-b-3xl shadow-md">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="#4B5563" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800">
              Quản lý sản phẩm
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(admin)/products/addProducts")}
            className="bg-blue-500 px-2 py-3 rounded-full shadow"
          >
            <Text className="text-white font-semibold">+ Thêm mới</Text>
          </TouchableOpacity>
        </View>
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-1">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-1"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            className={`mr-2 px-3 py-2 rounded-full min-w-[60px] items-center border text-xs transition-all duration-200 ${
              selectedCategory === category.id
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-blue-200"
            }`}
            style={{ height: 32 }}
          >
            <Text
              className={
                selectedCategory === category.id
                  ? "text-white font-semibold text-xs"
                  : "text-blue-500 text-xs"
              }
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <ScrollView className="px-4">
        {filteredProducts.map((product) => (
            <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(admin)/products/editProducts",
                params: { id: product.id },
              })
            }
            key={product.id}
            className="bg-white rounded-2xl p-5 mb-4 shadow-md flex-row items-center border border-gray-100"
            activeOpacity={0.85}
            >
            <Image
              source={{ uri: product.image }}
              className="w-20 h-20 rounded-xl mr-4 border border-gray-200"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="font-semibold text-lg text-gray-900 mb-1">
              {product.name}
              </Text>
              <Text className="text-gray-500 text-xs mb-1">
              {product.description}
              </Text>
              <Text className="text-gray-400 text-xs mb-1">
              {product.category}
              </Text>
              <View className="flex-row justify-between items-end mt-2">
              <Text className="text-blue-500 font-bold text-base">
                {product.price.toLocaleString()}₫
              </Text>
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-1 text-xs">
                Còn: {product.stock}
                </Text>
                <View
                className={`w-2 h-2 rounded-full ${
                  product.status === "active"
                  ? "bg-green-500"
                  : "bg-red-500"
                }`}
                />
              </View>
              </View>
            </View>
            </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
