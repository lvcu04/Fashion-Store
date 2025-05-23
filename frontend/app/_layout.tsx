import { Slot } from 'expo-router';
import { AuthContextProvider } from '@/context/authContext';
import { FavouriteProvider } from '@/context/favouriteContext'; // 👈 Thêm dòng này
import '@/global.css';

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <FavouriteProvider> 
        <Slot />
      </FavouriteProvider>
    </AuthContextProvider>
  );
}






