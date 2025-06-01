import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
};

type FavouriteContextType = {
  favourites: Product[];
  addFavourite: (product: Product) => void;
  removeFavourite: (id: string) => void;
  
};

const FavouriteContext = createContext<FavouriteContextType | undefined>(undefined);

export const FavouriteProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<Product[]>([]);

  const addFavourite = (product: Product) => {
    setFavourites((prev) =>
      prev.find((item) => item.id === product.id) ? prev : [...prev, product]
    );
  };

  const removeFavourite = (id: string) => {
    setFavourites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <FavouriteContext.Provider value={{ favourites, addFavourite, removeFavourite }}>
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouriteContext);
  if (!context) throw new Error('useFavourites must be used inside FavouriteProvider');
  return context;
};
