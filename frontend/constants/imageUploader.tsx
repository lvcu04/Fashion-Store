import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Alert, Platform } from "react-native";

const CLOUDINARY_UPLOAD_PRESET = "products";
const CLOUDINARY_CLOUD_NAME = "ddulpngsh";

export const pickImageAndUpload = async (): Promise<string | null> => {
  try {
    // Kiểm tra quyền truy cập thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Permission to access gallery is required!");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
      quality: 1,
    });


    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const selectedAsset = result.assets[0];

    const formData = new FormData();
    formData.append("file", {
      uri: selectedAsset.uri,
      name: `upload_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    interface CloudinaryUploadResponse {
      secure_url: string;
      [key: string]: any;
    }

    const response = await axios.post<CloudinaryUploadResponse>(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );

    return response.data.secure_url;
  } catch (error: any) {
    console.error("Lỗi upload ảnh:", error.response?.data || error.message);
    Alert.alert("Lỗi", "Không thể upload ảnh. Vui lòng thử lại.");
    return null;
  }
};
