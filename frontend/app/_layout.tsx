import { Slot } from 'expo-router';
import { AuthContextProvider } from '@/context/authContext';
import { CartProvider } from '@/context/cartContext';
import '@/global.css';
import { KeyboardAvoidingView,Platform } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { CheckoutProvider } from '@/context/checkoutContext';
import { ReviewProvider } from '@/context/reviewContext';

export default function RootLayout() {
  return (
     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} className="bg-white pt-5">
    <AuthContextProvider>
      <ReviewProvider>
          <CartProvider>
          <CheckoutProvider> 
            <I18nextProvider i18n={i18n}>
            <Slot />
            </I18nextProvider>
          </CheckoutProvider>
          </CartProvider>
        </ReviewProvider>
    </AuthContextProvider>
    </KeyboardAvoidingView>
  );
}






