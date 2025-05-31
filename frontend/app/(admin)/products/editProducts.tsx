import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { API } from "../../../constants/api";
import { pickImageAndUpload } from "../../../constants/imageUploader";
//pickImageAndUpload is a utility function to pick an image and upload it to a server


interface Product {
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
  quantity: number; // Optional field for quantity
}

interface Category {
  category_id: string;
  categoryName: string;
  slug: string;
  status: string;
}

export default function EditProductPage() {
  const { id: productId } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string>("");
  const [category_id, setCategory_id] = useState("");
  const [status, setStatus] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [quantity, setQuantity] = useState(""); // Optional field for quantity

  const [imageError, setImageError] = useState(false); // Thêm state lỗi ảnh

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products and categories in array, Promise.all allows parallel fetching
        const [productRes, categoryRes] = await Promise.all([
          fetch(API.product.getById(productId)),// first get product by productId
          fetch(API.category.all),
        ]);

        if (!productRes.ok || !categoryRes.ok) {
          throw new Error("Lỗi khi tải dữ liệu");
        }
        // Parse the JSON responses
        const productData = await productRes.json();
        const categoryData = await categoryRes.json();
        // Set the fetched data to state is empty
        setProduct(productData);
        setCategories(categoryData);

        setProductName(productData.productName || "");
        setDescription(productData.description || "");
        setPrice(productData.price?.toString() || "");
        setImage(productData.image || "");
        setCategory_id(productData.category_id || "");
        setStatus(productData.status || "");
        setSize(productData.size || "");
        setCondition(productData.condition || "");
        setLocation(productData.location || "");
        setSellerName(productData.sellerName || "");
        setQuantity(productData.quantity?.toString() || ""); // Set quantity if available
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    // Check if productId is available before fetching
    if (productId) {
      fetchData();
    }
  }, [productId]);
  //function to handle image picking and uploading
  const handlePickImage = async () => {
  const uploadedUrl = await pickImageAndUpload();
  if (uploadedUrl) {// Check if the URL is valid, then set the image state
    console.log("✅ Đã chọn ảnh:", uploadedUrl);
    setImage(uploadedUrl);
  }
};

  // Handle loading state by handleSave button
  const handleSave = async () => {
    try {
      //callback if any field is empty
      const updatedProduct = {
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
        quantity
      };
      // console.log("Dữ liệu gửi lên:", updatedProduct);

      //function call api update product by productId
      const response = await fetch(API.product.edit(productId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error("Cập nhật thất bại");
      }

      Alert.alert("Thành công", "Đã cập nhật sản phẩm!");
      // console.log("Đang render ảnh với URL:", image);

      router.replace({
        pathname: "/(admin)/products",
        params: { shouldRefresh: "true" }
      });
    } catch (err) {
      Alert.alert("Lỗi", "Không thể lưu thay đổi!");
      console.error(err);
    }
  };

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
  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-4">
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

      <View className="items-center mb-6">
        <Image
          source={{ uri: image || "https://via.placeholder.com/150" }}
          style={{ width: 128, height: 128 }}
          // onError={() => {
          //   console.log("❌ Ảnh lỗi:", image);
          // }}
        />

        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg mb-2"
          onPress={handlePickImage}
          >
          <Text className="text-white font-semibold">Chọn ảnh từ thiết bị</Text>
        </TouchableOpacity>

        <Text className="text-gray-700 font-semibold mb-1">Hoặc nhập URL ảnh</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 w-full"
          value={image}
          onChangeText={(text) => {
            setImage(text);
            setImageError(false); // reset lại lỗi khi user nhập lại URL
          }}
          placeholder="Nhập URL ảnh sản phẩm"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View className="bg-white rounded-2xl p-4 shadow-md mb-8">
        <Text className="mb-1 text-gray-700 font-semibold">Tên sản phẩm</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
          value={productName}
          onChangeText={setProductName}
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
        <Text className="mb-1 text-gray-700 font-semibold">Số lượng</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
          placeholder="Nhập số lượng"
          placeholderTextColor="#9CA3AF"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        <Text className="mb-1 text-gray-700 font-semibold">Kích cỡ</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
          value={size}
          onChangeText={setSize}
        />

        <Text className="mb-1 text-gray-700 font-semibold">Tình trạng</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
          value={condition}
          onChangeText={setCondition}
        />

        <Text className="mb-1 text-gray-700 font-semibold">Địa điểm</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
          value={location}
          onChangeText={setLocation}
        />

        <Text className="mb-1 text-gray-700 font-semibold">Người bán</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
          value={sellerName}
          onChangeText={setSellerName}
        />

        <Text className="mb-1 text-gray-700 font-semibold">Danh mục</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.category_id}
              onPress={() => setCategory_id(cat.category_id)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                category_id === cat.category_id
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-blue-200"
              }`}
            >
              <Text
                className={
                  category_id === cat.category_id
                    ? "text-white font-semibold"
                    : "text-blue-500"
                }
              >
                {cat.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text className="mb-1 text-gray-700 font-semibold">Trạng thái</Text>
        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setStatus("Stock")}
            className={`mr-2 px-4 py-2 rounded-full border ${
              status === "Stock"
                ? "bg-green-500 border-green-500"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={
                status === "Stock"
                  ? "text-white font-semibold"
                  : "text-green-500"
              }
            >
              Stock
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setStatus("Unstock")}
            className={`px-4 py-2 rounded-full border ${
              status === "Unstock"
                ? "bg-red-500 border-red-500"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={
                status === "Unstock"
                  ? "text-white font-semibold"
                  : "text-red-500"
              }
            >
              Unstock
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-xl items-center mt-2"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-base">Save changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
