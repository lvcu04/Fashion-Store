import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState,useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, UIManager, findNodeHandle, TextInput , Modal ,KeyboardAvoidingView, TouchableWithoutFeedback, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { API } from '@/constants/api';
import { useCart } from '@/context/cartContext';
import { useReview } from '@/context/reviewContext';
import { useAuth } from '@/context/authContext';
type Product = {
  product_id: string;
  productName: string;
  image: string;
  title: string;
  price: number;
  category_id?: string;
};

const ProductDetailScreen = () => {
  const { id: product_id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const {userProfile} = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const [cartBadgeCount, setCartBadgeCount] = useState(0);
  
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const { addReview, getReviewByProduct } = useReview();

  const reviewsForProduct = getReviewByProduct(product_id);
  const averageRating = reviewsForProduct.length > 0 ? reviewsForProduct.reduce((sum,r) => sum + r.rating,0) / reviewsForProduct.length : 0;
  const productImageRef = useRef<View>(null);
  const cartIconRef = useRef<View>(null);

  const animX = useSharedValue(0);
  const animY = useSharedValue(0);
  const scale = useSharedValue(1);
  const showImage = useSharedValue(false);
  const flyStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: animY.value,
    left: animX.value,
    transform: [{ scale: scale.value }],
    opacity: showImage.value ? 1 : 0,
    zIndex: 999,
    pointerEvents: 'none',
  }));
  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch(API.product.getById(productId));
      const productData = await response.json();
      setData(productData);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (product_id) {
      fetchProductDetails(product_id);
    }
  }, [product_id]);

  const handleAddToCart = () => {
    if (!productImageRef.current || !cartIconRef.current) return;

    UIManager.measure(
      findNodeHandle(productImageRef.current)!,
      (x, y, width, height, pageX, pageY) => {
        animX.value = pageX;
        animY.value = pageY;
        showImage.value = true;

        UIManager.measure(
          findNodeHandle(cartIconRef.current)!,
          (x2, y2, w2, h2, pageX2, pageY2) => {
            animX.value = withTiming(pageX2 + w2 / 2 - 50, { duration: 500 });
            animY.value = withTiming(pageY2 + h2 / 2 - 50, { duration: 500 });
            scale.value = withTiming(0.3, { duration: 500 }, () => {
              showImage.value = false;
            });
          }
        );
      }
    );
  };

  const addToCartAndFly = () => {
  // Gọi addToCart ngay lập tức
  const item = {
    product_id,
    productName: data.productName,
    image: data.image,
    price: data.price,
    quantity: quantity,
  };

  addToCart(item); // gọi ngay
  setCartBadgeCount(prev => prev + quantity);

  // Sau đó gọi hiệu ứng
  handleAddToCart();
};

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Loading...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Product not found</Text>
      </View>
    );
  }


  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <>
      <ScrollView className="flex-1 bg-slate-50">
        {/* Back & Wishlist */}
        <View className="flex-row justify-between items-center px-4 py-2 mt-5">
          <TouchableOpacity  onPress={() => router.push('/(tabs)/home')}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          
          
        </View>

        {/* Product Image */}
        <View className="p-5"  ref={productImageRef}>
          <Image
            source={{ uri: data.image }}
            style={{ width: '100%', height: 320 }}
            className="bg-white my-4"
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View className="px-5 py-5 rounded-t-3xl bg-white">
          <Text className="text-2xl font-bold">{data.productName}</Text>

          {/* Rating, Reviews & Status */}
          <View className="flex-row justify-between items-center mt-2">
            <TouchableOpacity onPress={() => setShowComments(!showComments)} className="flex-row items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <AntDesign
                  key={star}
                  name="star"
                  size={14}
                  color={star <= Math.round(averageRating) ? '#facc15' : '#d1d5db'}
                />
              ))}
              <Text className="text-xs ml-1">({reviewsForProduct.length} Reviews)</Text>
            </TouchableOpacity>
            <Text className={`font-semibold ${data.status === 'Stock' ? 'text-green-600' : 'text-red-500'}`}>
              {data.status}
            </Text>
          </View>

          {/* Size */}
          <Text className="font-bold text-lg mt-4">Size</Text>
          <View className="flex-row flex-wrap mt-2">
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                className={` rounded-full px-4 py-2 m-1 ${selectedSize === size ? 'bg-black' : 'bg-gray-200'}`}
                onPress={() => setSelectedSize(size)}
              >
                <Text className={`${selectedSize === size  ? 'text-white' : ''} text-base font-medium`}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text className="font-bold text-lg mt-4">Description</Text>
          <Text className="text-gray-600 mt-2">{data.description}</Text>

          {/* Quantity Selector & Price */}
          <View className="flex-row justify-between items-center mt-6">
            <View className="flex-row items-center bg-gray-200 rounded-lg">
              <TouchableOpacity
                onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="px-3 py-2"
              >
                <Text className="text-xl">-</Text>
              </TouchableOpacity>
              <Text className="px-4 py-2 text-lg">{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="px-3 py-2"
              >
                <Text className="text-xl">+</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold"> {data.price.toLocaleString("vi-VN")}VNĐ</Text>
          </View>

          {/* Additional Info */}
          <View className="my-6">
            <Text className="text-lg font-semibold mb-3">Additional Information</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Condition</Text>
              <Text className="font-medium">{data.condition}</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Location</Text>
              <Text className="font-medium">{data.location}</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Seller</Text>
              <Text className="font-medium">{data.sellerName}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Quantity</Text>
              <Text className="font-medium">{data.quantity}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="flex-row items-center px-4 py-4 border-t border-gray-200">
        <TouchableOpacity className="flex-1 bg-black rounded-full py-4 mr-3 mb-5"
         onPress={addToCartAndFly}
        >
          <Text className="text-white text-center font-semibold">
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          ref={cartIconRef}
          onPress={
            () => {router.push('/(cart)/Cart');
            setCartBadgeCount(0);
          }}
          className=" relative mb-5 w-14 h-14 items-center justify-center rounded-full bg-gray-100"
        >
              {cartBadgeCount > 0 && (
                <View className="absolute -top-0 -right-0 bg-red-500 rounded-full px-1.5 py-0.5">
                  <Text className="text-white text-xs font-bold">{cartBadgeCount}</Text>
                </View>
              )}
          <MaterialIcons name="shopping-cart" size={24} color="black" />
        </TouchableOpacity>
      </View>


      <Modal
  animationType="slide"
  transparent
  visible={showComments}
  onRequestClose={() => setShowComments(false)}
>
  <TouchableWithoutFeedback onPress={() => setShowComments(false)}>
    <View className="flex-1 justify-end bg-black/40">
      <TouchableWithoutFeedback>
        <View
          className="bg-white rounded-t-3xl px-5 pt-4 pb-6"
          style={{ height: '80%' }}
        >
          <Text className="text-lg font-bold mb-4 text-center">Reviews Product</Text>

          {/* Scroll các comment */}
          <ScrollView
            className="mb-4 flex-1"
            keyboardShouldPersistTaps="handled"
          >
            {getReviewByProduct(product_id).map((review, idx) => (
              <View key={idx} className="mb-3 p-3 bg-gray-100 rounded-xl">
                <Text className="font-bold">{review.username}</Text>
                <Text className="text-yellow-500">Rating: {review.rating} ⭐</Text>
                <Text className="text-gray-700">{review.comment}</Text>
                <Text className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleString()}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Bọc phần nhập comment trong KeyboardAvoidingView */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
          >
            <Text className="font-semibold mb-1">Add a new review:</Text>

            <View className="flex-row mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                  <AntDesign
                    name="star"
                    size={20}
                    color={star <= newRating ? '#facc15' : '#d1d5db'}
                    style={{ marginRight: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View className="bg-white rounded-md border border-gray-300 p-2 mb-2">
              <TextInput
                placeholder="Write your comment..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
            </View>

            <TouchableOpacity
              className="bg-black py-2 px-4 rounded-full mt-2"
              onPress={() => {
                if (newComment.trim()) {
                  addReview({
                    uid: Math.random().toString(36).substr(2, 9),
                    product_id,
                    username: userProfile?.name,
                    rating: newRating,
                    comment: newComment,
                    createdAt: new Date().toISOString(),
                  });
                  setNewComment('');
                  setNewRating(5);
                }
              }}
            >
              <Text className="text-white text-center">Submit Review</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>





   {/* Flying Image */}
      <Animated.Image
        source={{ uri: data.image }}
        style={[{ width: 100, height: 100, borderRadius: 50 }, flyStyle]}
      />

    </>
  );
};

export default ProductDetailScreen;

