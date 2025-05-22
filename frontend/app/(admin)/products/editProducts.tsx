import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import {
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { categories, mockProducts } from "../products/index";



export default function EditProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = mockProducts.find((p) => p.id === id);

  // Nếu không tìm thấy sản phẩm
  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-500">Không tìm thấy sản phẩm</Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-blue-500 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // State cho form
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [category, setCategory] = useState(product.category);
  const [image, setImage] = useState(product.image);
  const [stock, setStock] = useState(product.stock.toString());
  const [status, setStatus] = useState(product.status);
  const [description, setDescription] = useState(product.description);

  const handleSave = () => {
    // Ở đây bạn sẽ gọi API để cập nhật sản phẩm
    Alert.alert("Lưu thành công", "Thông tin sản phẩm đã được cập nhật!");
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-8">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">
          Chỉnh sửa sản phẩm
        </Text>
      </View>

      {/* Ảnh sản phẩm */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: image }}
          className="w-32 h-32 rounded-xl border border-gray-200"
          resizeMode="cover"
        />
        {/* Có thể thêm nút đổi ảnh ở đây */}
      </View>

      {/* Form */}
      <View className="bg-white rounded-2xl p-4 shadow-md mb-8">
        <Text className="mb-1 text-gray-700 font-semibold">Tên sản phẩm</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
          value={name}
          onChangeText={setName}
        />

        <Text className="mb-1 text-gray-700 font-semibold">Mô tả</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text className="mb-1 text-gray-700 font-semibold">Giá (₫)</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text className="mb-1 text-gray-700 font-semibold">Danh mục</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                category === cat.id
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-blue-200"
              }`}
            >
              <Text
                className={
                  category === cat.id
                    ? "text-white font-semibold"
                    : "text-blue-500"
                }
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text className="mb-1 text-gray-700 font-semibold">Số lượng tồn kho</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />

        <Text className="mb-1 text-gray-700 font-semibold">Trạng thái</Text>
        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setStatus("active")}
            className={`mr-2 px-4 py-2 rounded-full border ${
              status === "active"
                ? "bg-green-500 border-green-500"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={
                status === "active"
                  ? "text-white font-semibold"
                  : "text-green-500"
              }
            >
              Đang bán
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setStatus("inactive")}
            className={`px-4 py-2 rounded-full border ${
              status === "inactive"
                ? "bg-red-500 border-red-500"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={
                status === "inactive"
                  ? "text-white font-semibold"
                  : "text-red-500"
              }
            >
              Ngừng bán
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-xl items-center mt-2"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-base">Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
