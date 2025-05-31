import { useState, useEffect } from "react";
import { View, ScrollView, TextInput, Text, TouchableOpacity, Image, Alert } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { API } from "../../../constants/api";
import { router } from "expo-router";
import { pickImageAndUpload } from "../../../constants/imageUploader";

export default function AddProduct() {
  const [product_id, setProductId] = useState("");
  const [productIdError, setProductIdError] = useState("");
  const [productName, setProductName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [status, setStatus] = useState("Còn");
  const [category_id, setCategory_id] = useState("");
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(""); // Optional field for quantity

  // Fetch categories 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API.category.all);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleAdd = async () => {
  if (!productName || !price) {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin chính.");
    return;
  }
  console.log("Adding product with data:", {
    product_id,
    productName,
    description,
    price,
    image,
    size,
    condition,
    location,
    sellerName,
    category_id,
    status,
    quantity
  });

  try {
    const newProduct = {
      product_id,
      productName,
      description,
      price: parseFloat(price),
      image,
      size,
      condition,
      location,
      sellerName,
      category_id,
      status,
      quantity: quantity ? parseInt(quantity) : 0, 
    };
    //call api to add product
    const res = await fetch(API.product.add, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    const errorData = await res.json();
    // if have error, log it
    console.log("Lỗi chi tiết từ server:", errorData);


    if (!res.ok) {
      const errorData = await res.json();

      
      if (
        errorData?.message?.toLowerCase().includes("product id already exists")
      ) {
        setProductIdError("Mã sản phẩm đã tồn tại, vui lòng chọn mã khác.");
        return;
      }
      throw new Error("Thêm sản phẩm thất bại");
    }
    

    Alert.alert("Thành công", "Sản phẩm đã được thêm.");
    router.replace({
      pathname: "/(admin)/products",
      params: { shouldRefresh: "true" }
    });
  } catch (error) {
    console.error(error);
    Alert.alert("Lỗi", "Không thể thêm sản phẩm.");
  }
};


  return (
      <ScrollView
        className="bg-white"
        contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 50 }}
      >
        <Text className="text-2xl font-bold mb-4 text-blue-600 text-center">
          Thêm sản phẩm mới
        </Text>

        <TextInput
          placeholder="mã sản phẩm"
          value={product_id}
          onChangeText={setProductId}
          className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
        />

        <TextInput
          placeholder="Tên sản phẩm"
          value={productName}
          onChangeText={setProductName}
          className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
        />

       <TouchableOpacity
          onPress={async () => {
            const url = await pickImageAndUpload();
            if (url) setImage(url);
          }}
          className="border border-gray-300 rounded-xl px-4 py-2 mb-4 bg-gray-100 items-center"
        >
          <Text className="text-blue-600">
            {image ? "Đổi ảnh" : "Chọn ảnh từ thiết bị"}
          </Text>
        </TouchableOpacity>
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-full h-40 rounded-xl mb-4 border border-gray-200"
            resizeMode="cover"
        />
        ) : null}


        <TextInput
          placeholder="Mô tả sản phẩm"
          value={description}
          onChangeText={setDescription}
          multiline
          className="border border-gray-300 rounded-xl px-4 py-2 mb-4 h-24 text-sm"
        />

        <TextInput
          placeholder="Giá"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
        />

        <TextInput
          placeholder="Kích thước (Size)"
          value={size}
          onChangeText={setSize}
          className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
        />
        <TextInput
          placeholder="Số lượng (tùy chọn)"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
        />

        <TextInput
          placeholder="Tình trạng (Mới/Cũ)"
          value={condition}
          onChangeText={setCondition}
          className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
        />

        <TextInput
          placeholder="Địa điểm"
          value={location}
          onChangeText={setLocation}
          className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
        />

        <TextInput
          placeholder="Tên người bán"
          value={sellerName}
          onChangeText={setSellerName}
          className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
        />

        <Text className="text-gray-700 font-semibold mb-2">Trạng thái</Text>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => setStatus("Stock")}
            className={`flex-row items-center px-4 py-2 rounded-full ${
              status === "Stock" ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text className="ml-2 text-white">Stock</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setStatus("UnStock")}
            className={`flex-row items-center px-4 py-2 rounded-full ml-4 ${
              status === "UnStock" ? "bg-red-500" : "bg-gray-200"
            }`}
          >
            <Ionicons name="close-circle" size={20} color="white" />
            <Text className="ml-2 text-white">UnStock</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal className="mb-4">
          {categories.map((cat: any) => (
            <TouchableOpacity
              key={cat.category_id}
              onPress={() => setCategory_id(cat.category_id)}
              className={`mr-2 px-3 py-2 rounded-full min-w-[60px] items-center border text-xs transition-all duration-200 ${
                category_id === cat.category_id
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-blue-200"
              }`}
            >
              <Text
                className={
                  category_id === cat.category_id
                    ? "text-white font-semibold text-xs"
                    : "text-blue-500 text-xs"
                }
                numberOfLines={1}
              >
                {cat.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={handleAdd}>
          <View className="bg-blue-500 items-center rounded-xl p-4 shadow">
            <Text className="font-semibold text-white">Thêm sản phẩm</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
  );
}
