import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/context/authContext';

export default function AuthLayout() {
  const { isAuthenticated ,role } = useAuth();

  if (isAuthenticated === undefined) return null;

  // if(!isAuthenticated) return <Redirect href="/(auth)/login" />;
 
  if(isAuthenticated){
    if( role === 'admin') return <Redirect href="/(admin)" />; 
    return <Redirect href="/(tabs)/home" />; 
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" options={{ title: 'Giới thiệu' }} />
      <Stack.Screen name="login" options={{ title: 'Đăng nhập' }} />
      <Stack.Screen name="register" options={{ title: 'Đăng ký' }} />
    </Stack>
  );
}
