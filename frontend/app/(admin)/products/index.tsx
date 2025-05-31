import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { API } from "../../../constants/api";

export interface Product {
  product_id: string;
  productName: string;
  image: string;
  description: string;
  price: number;
  size: string;
  condition: string;
  location: string;
  sellerName: string;
  category_id: string;
  status: string;
  quantity: number;
}

export interface Category {
  category_id: string;
  categoryName: string;
  slug: string;
  status: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  // State to manage loading state can be added if needed
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products and categories in array, Promise.all allows parallel fetching
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(API.product.all),
          fetch(API.category.all),
        ]);
      
        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Không thể lấy dữ liệu từ máy chủ");
        }
          // Parse the JSON responses
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định");
        console.error("Lỗi fetch:", err);
      }
    };

    fetchData();
  }, []);
 // Function to get category name by category_Id
  const getCategoryName = (id: string) => {
    const category = categories.find((cat) => cat.category_id === id);
    return category ? category.categoryName : "Không rõ danh mục";
  };
  // Filter products based on search query and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // if (error) {
  //   return <Text className="text-red-500 text-center mt-4">{error}</Text>;
  // }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 pt-6 pb-2 rounded-b-3xl shadow-md">
        {/*  HEADER */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.push("/(admin)")}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-3"
            >
            <Ionicons name="arrow-back" size={24} color="#4B5563" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">
            Product Management
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(admin)/products/addProducts")}
            className="bg-blue-500 px-3 py-2 rounded-full"
            >
            <Text className="text-white font-semibold text-sm">+ Add Product</Text>
          </TouchableOpacity>
        </View>
        {/* SEARCH */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {/* CATEGORIES */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-1 py-3"
           >
            {/* if setSelectedCategory("all"), change box is blue and text is white */}
          <TouchableOpacity
            onPress={() => setSelectedCategory("all")}
            className={`mr-2 px-3 py-2 rounded-full min-w-[60px] items-center border text-xs ${
              selectedCategory === "all"
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-blue-200"
            }`}
              >
            <Text
              className={`text-xs font-medium ${
                selectedCategory === "all" ? "text-white" : "text-blue-500"
              }`}
             >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.category_id}
              onPress={() => setSelectedCategory(category.category_id)}
              className={`mr-2 px-3 py-2 rounded-full min-w-[60px] items-center border text-xs ${
                selectedCategory === category.category_id
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-blue-200"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  selectedCategory === category.category_id
                    ? "text-white"
                    : "text-blue-500"
                }`}
                numberOfLines={1}
              >
                {category.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="px-4 py-2" showsVerticalScrollIndicator={false}>
        {filteredProducts.map((product) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(admin)/products/editProducts",
                params: { id: product.product_id },
              })
            }
            key={product.product_id}
            className="bg-white rounded-2xl p-5 mb-4 shadow-sm flex-row items-center border border-gray-100"
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: product.image }}
              className="w-20 h-20 rounded-xl mr-4 border border-gray-200"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="font-semibold text-lg text-gray-900">
                {product.productName}
              </Text>
              <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>
                {product.description}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {product.size} - {product.condition} - {product.location}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Quantity: {product.quantity}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">
                Seller Name: {product.sellerName}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">
                Categories: {getCategoryName(product.category_id)}
              </Text>
              <View className="flex-row justify-between items-end mt-2">
                <Text className="text-blue-500 font-bold text-base">
                  {product.price.toLocaleString()}₫
                </Text>
                <View className="flex-row items-center">
                  {product.quantity === 0 ? (
                  <>
                    <Text className="text-red-500 text-xs">Unstock</Text>
                    <View className="ml-1 w-2 h-2 rounded-full bg-red-500" />
                  </>
                  ) : (
                  <>
                    <Text className="text-green-500 text-xs">Stock</Text>
                    <View className="ml-1 w-2 h-2 rounded-full bg-green-500" />
                  </>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
