import { useAuth } from '@/context/authContext';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login, handleGoogleLogin, handleFacebookLogin } = useAuth();

  // Load custom font
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        GreatVibes: require('@/assets/fonts/GreatVibes-Regular.ttf'),
      });
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      alert('Đăng nhập thất bại: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await handleGoogleLogin();
      router.replace('/(tabs)/home');
    } catch (error: any) {
      alert('Đăng nhập bằng Google thất bại: ' + error.message);
    }
  };

  const handleFacebook = async () => {
    try {
      await handleFacebookLogin();
      router.replace('/(tabs)/home');
    } catch (error: any) {
      alert('Đăng nhập bằng Facebook thất bại: ' + error.message);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      {/* Logo */}
      <View className="items-center mb-6">
        <Text
          style={{
            fontFamily: 'GreatVibes',
            fontSize: 48,
            color: '#1A2E40',
          }}
        >
          Fashions
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#3B4F63',
            fontStyle: 'italic',
            marginTop: -6,
          }}
        >
          My Life My Style
        </Text>
      </View>

      <Text className="text-xl font-semibold text-center mb-1">Welcome!</Text>
      <Text className="text-center text-gray-500 mb-6">
        please login or sign up to continue our app
      </Text>

      <TextInput
        className="w-full bg-gray-100 p-4 rounded-xl mb-4 border border-gray-300"
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password input with show/hide toggle (updated) */}
      <View className="relative mb-6">
        <TextInput
          className="w-full bg-gray-100 p-4 rounded-xl border border-gray-300 pr-12"
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          className="absolute right-4 top-4"
          onPress={() => setShowPassword(!showPassword)}
        >
          <FontAwesome
            name={showPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-black p-4 rounded-full items-center mt-6"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white font-semibold">
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center my-2">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-500">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>
      <View className="space-y-3 mb-6">
        <TouchableOpacity
          onPress={handleFacebook}
          className="flex-row mb-3 items-center justify-center bg-blue-700 px-4 py-3 rounded-full"
        >
          <FontAwesome name="facebook" size={20} color="white" />
          <Text className="text-white ml-2 font-medium">Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoogle}
          className="flex-row mb-3 items-center justify-center bg-white border border-gray-300 px-4 py-3 rounded-full"
        >
          <FontAwesome name="google" size={20} color="black" />
          
          <Text className="ml-2 font-medium">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row mb-1 items-center justify-center bg-white border border-gray-300 px-4 py-3 rounded-full"
        >
          <FontAwesome name="apple" size={20} color="black" />
          <Text className="ml-2 font-medium">Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text className="text-blue-600 text-center font-medium">
          Don’t have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
