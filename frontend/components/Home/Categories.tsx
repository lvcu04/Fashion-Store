import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';

interface Category {
  category_id: string;
  categoryName: string;
}

interface CategorysProps {
  categories: Category[];
  onCategorySelect: (category_id: string) => void;
}

const Categories: React.FC<CategorysProps> = ({ categories, onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const { t } = useTranslation();

  const handleCategoryPress = (category_id: string) => {
    setSelectedCategory(category_id);
    onCategorySelect(category_id);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
      <View className="flex-row">
        {categories.map((category) => {
          const isSelected = category.category_id === selectedCategory;
          return (
            <TouchableOpacity
              key={category.category_id}
              onPress={() => handleCategoryPress(category.category_id)}
              className={`p-3 rounded-full mr-3 ${
                isSelected ? 'bg-blue-500' : 'bg-gray-100'
              }`}
            >
              <Text className={`${isSelected ? 'text-white' : 'text-gray-700'}`}>
                {t(`categoryNames.${category.categoryName}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Categories;
