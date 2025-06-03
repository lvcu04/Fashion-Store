import { Slot } from 'expo-router';
import { AuthContextProvider } from '@/context/authContext';
import { FavouriteProvider } from '@/context/favouriteContext'; 
import '@/global.css';
import { KeyboardAvoidingView,Platform } from 'react-native';


export default function RootLayout() {
  return (
     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} className="bg-white pt-5">
    <AuthContextProvider>
      <FavouriteProvider> 
        <Slot />
      </FavouriteProvider>
    </AuthContextProvider>
    </KeyboardAvoidingView>
  );
}






