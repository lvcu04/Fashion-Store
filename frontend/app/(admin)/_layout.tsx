import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/context/authContext';

export default function AdminLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) return null;
  // if (isAuthenticated) return <Redirect href="/(tabs)/home" />;
  // if (isAuthenticated) return <Redirect href="/admin/layout" />;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Giới thiệu' }} />
      <Stack.Screen name="products/index" options={{ title: 'Sản phẩm' }} />
      <Stack.Screen name="orders/index" options={{ title: 'Đơn hàng' }} />
      <Stack.Screen name="users/index" options={{ title: 'Người dùng' }} />
    </Stack>
  );
}
