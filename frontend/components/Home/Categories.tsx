import { View, Text,ScrollView,TouchableOpacity} from 'react-native'
import React from 'react'

interface Category {
  id: number;
  categoryName: string;
}
interface CategorysProps {
  categories: Category[];
}

const Categories: React.FC<CategorysProps> = ( {categories} ) => {

  return (
    <>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
        <TouchableOpacity className='flex-row'>
            {categories.map((category) => (
            <View
            key={category.id}
            className="bg-gray-100 p-3 rounded-full mr-3"
            >
            <Text className="text-gray-700">{category.categoryName}</Text>
            </View>
        ))}
        </TouchableOpacity>
    </ScrollView>
    </>
  )
}

export default Categories