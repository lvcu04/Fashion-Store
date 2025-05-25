import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'FAVOURITES_LIST';

export const addToFavourites = async (item: any) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = existing ? JSON.parse(existing) : [];
    const exists = parsed.find((p: any) => p.id === item.id);
    if (!exists) {
      const updated = [...parsed, item];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Error adding to favourites:', e);
  }
};