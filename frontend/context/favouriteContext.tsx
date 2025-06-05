// context/favouContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  product_id: string;
  image: string;
  productName: string;
  price: number;
  category_id: string;
};

type FavouritesContextType = {
  favourites: Product[];
  addFavourite: (product: Product) => void;
  removeFavourite: (productId: string) => void;
};

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<Product[]>([]);

  // Load từ AsyncStorage khi app mở
  useEffect(() => {
    const loadFavourites = async () => {
      const data = await AsyncStorage.getItem('favourites');
      if (data) setFavourites(JSON.parse(data));
    };
    loadFavourites();
  }, []);

  // Lưu vào AsyncStorage mỗi khi thay đổi
  useEffect(() => {
    AsyncStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const addFavourite = (product: Product) => {
    setFavourites((prev) => [...prev, product]);
  };

  const removeFavourite = (productId: string) => {
    setFavourites((prev) => prev.filter((p) => p.product_id !== productId));
  };

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};
