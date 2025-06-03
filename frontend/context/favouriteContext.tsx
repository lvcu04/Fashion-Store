import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Product = {
  product_id: string;
  productName: string;
  image: string;
  title: string;
  price: number;

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
      prev.find((item) => item.product_id === product.product_id) ? prev : [...prev, product]
    );
  };

  const removeFavourite = (product_id: string) => {
    setFavourites((prev) => prev.filter((item) => item.product_id !== product_id));
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
