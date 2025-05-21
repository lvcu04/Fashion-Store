import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const OrderDetails = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  // Dữ liệu mẫu cho chi tiết đơn hàng (có thể thay bằng API)
  const orderDetail = {
    orderId: orderId,
    title: 'Soludos Ibiza Classic Lace Sneakers',
    price: 120.00,
    quantity: 1,
    size: 42,
    color: '#d1d5db',
    image: 'https://via.placeholder.com/150/FF6F61/FFFFFF?text=Sneakers',
    orderDate: 'May 15, 2025',
    status: 'Shipped',
    shippingAddress: '123 Example St, Hanoi, Vietnam',
    paymentMethod: 'Credit Card',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <View style={styles.card}>
        <Image
          source={{ uri: orderDetail.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.label}>Order ID: {orderDetail.orderId}</Text>
        <Text style={styles.label}>Product: {orderDetail.title}</Text>
        <Text style={styles.label}>Price: ${orderDetail.price.toFixed(2)}</Text>
        <Text style={styles.label}>Quantity: {orderDetail.quantity}</Text>
        <Text style={styles.label}>Size: {orderDetail.size}</Text>
        <Text style={styles.label}>Color: </Text>
        <View style={{ backgroundColor: orderDetail.color, width: 20, height: 20, borderRadius: 10, marginBottom: 8 }} />
        <Text style={styles.label}>Order Date: {orderDetail.orderDate}</Text>
        <Text style={styles.label}>Status: {orderDetail.status}</Text>
        <Text style={styles.label}>Shipping Address: {orderDetail.shippingAddress}</Text>
        <Text style={styles.label}>Payment Method: {orderDetail.paymentMethod}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 8,
  },
});

export default OrderDetails;