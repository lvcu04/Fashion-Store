import React,{useState} from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';



export default function SettingsScreen() {
  const route = useRouter();
  const { t, i18n } = useTranslation();

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <View className="flex-1 bg-white p-5">
      <View className='flex flex-row items-center justify-start mb-4'>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => route.push("/(tabs)/profile")} />
        <Text className="text-xl font-bold ml-3">{t('Settings')}</Text>
      </View>
      <View className="bg-white rounded-2xl shadow p-4 space-y-4 border border-gray-200">

        {/* Language */}
        <TouchableOpacity className="flex-row items-center justify-between" onPress={() => {
          i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en');
        }}>
          <View className="flex-row items-center space-x-3">
            <View className="bg-gray-100 p-2 rounded-xl">
              <Ionicons name="language" size={20} color="black" />
            </View>
            <Text className="text-base">{t('Language')}</Text>
          </View>
          <View className='flex-row items-center'>
            <Text className="text-gray-400 mr-2">{i18n.language === 'en' ? 'English' : 'Tiếng Việt'}</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </View>
        </TouchableOpacity>

        {/* Notification */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <View className="bg-gray-100 p-2 rounded-xl">
              <Ionicons name='barbell' size={20} color="black" />
            </View>
            <Text className="text-base">{t('Notification')}</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        {/* Dark Mode */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <View className="bg-gray-100 p-2 rounded-xl">
              <Ionicons name='moon' size={20} color="black" />
            </View>
            <Text className="text-base">{t('Dark Mode')}</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <Text className="text-gray-400">{darkMode ? 'on' : 'off'}</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        {/* Help Center */}
        <TouchableOpacity className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <View className="bg-gray-100 p-2 rounded-xl">
              <Ionicons name='help' size={20} color="black" />
            </View>
            <Text className="text-base">{t('Help Center')}</Text>
          </View>
        </TouchableOpacity>

      </View>
    </View>
  );
}

