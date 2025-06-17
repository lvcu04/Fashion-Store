import { useAuth } from '@/context/authContext';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    receiverName?: string;
  };
  paymentMethod?: {
    type: string;
    isDefault: boolean;
  }[];
}


const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!agreeTerms) {
      alert('You must agree to the terms and conditions.');
      return;
    }

    if (!username || !email || !password || !confirmPassword || !phone) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    const formatPhone = (phone: string) => {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.startsWith('0')) return '+84' + cleaned.slice(1);
      if (cleaned.startsWith('84')) return '+' + cleaned;
      if (cleaned.startsWith('+')) return cleaned;
      return '+84' + cleaned;
    };

    const formattedPhone = formatPhone(phone);

    if (!formattedPhone?.match(/^\+?[1-9]\d{7,14}$/)) {
      alert('Số điện thoại không hợp lệ (ví dụ: +84901234567)');
      return;
    }
   try {
      const formattedPhone = formatPhone(phone);

      const payload: RegisterPayload = {
        email,
        password,
        name: username,
        phone: formattedPhone,
        paymentMethod: [
          { type: 'COD', isDefault: true },
          { type: 'MOMO', isDefault: false }
        ],
     
        address: {
          street: '',
          city: '',
          receiverName: ''
        }
      };

      await register(payload);
      alert('Đăng ký thành công. Vui lòng đăng nhập lại.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      alert('Đăng ký thất bại: ' + error.message);
    }
  };



  return (
    <ScrollView className="flex-1 bg-white px-6">
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

      <Text className="text-2xl font-semibold mb-1">Sign Up</Text>
      <Text className="text-gray-500 mb-6">Create an new account</Text>

      <TextInput
        className="w-full bg-gray-100 p-4 rounded-xl mb-4 border border-gray-300"
        placeholder="User Name"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        className="w-full bg-gray-100 p-4 rounded-xl mb-4 border border-gray-300"
        placeholder="User Phone"
        value={phone}
        onChangeText={setPhone}
      />


      <TextInput
        className="w-full bg-gray-100 p-4 rounded-xl mb-4 border border-gray-300"
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password input with show/hide */}
      <View className="relative mb-4">
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

      {/* Confirm Password input with show/hide */}
      <View className="relative mb-4">
        <TextInput
          className="w-full bg-gray-100 p-4 rounded-xl border border-gray-300 pr-12"
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          className="absolute right-4 top-4"
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <FontAwesome
            name={showConfirmPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => setAgreeTerms(!agreeTerms)}
      >
        <View className="w-5 h-5 border border-gray-400 rounded-sm mr-2 items-center justify-center bg-white">
          {agreeTerms && <FontAwesome name="check" size={12} color="black" />}
        </View>
        <Text className="text-gray-500 text-base">
          By creating an account you have to agree with our terms & conditions.
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-black p-4 rounded-full items-center mb-10"
        onPress={handleRegister}
      >
        <Text className="text-white font-semibold">Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;

