import { Slot } from 'expo-router';
import { AuthContextProvider } from '@/context/authContext';
import '@/global.css';
export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Slot />
    </AuthContextProvider>
  );
}
