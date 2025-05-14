import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleRegister = () => {
    if (!agreeTerms) {
      alert('You must agree to the terms and conditions.');
      return;
    }

    // TODO: Registration logic
    alert('Registered successfully!');
    router.replace('/(tabs)/home');
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
            name={showConfirmPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => setAgreeTerms(!agreeTerms)}
      >
        <View className="w-5 h-5 border border-gray-400 rounded-sm mr-3 items-center justify-center bg-white">
          {agreeTerms && <FontAwesome name="check" size={14} color="black" />}
        </View>
        <Text className="text-gray-500 text-sm">
          By creating an account you have to agree with our them & condition.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-black p-4 rounded-full items-center mb-10"
        onPress={handleRegister}
      >
        <Text className="text-white font-semibold">Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;
