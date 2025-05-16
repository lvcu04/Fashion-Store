import { View, Text,ScrollView,TouchableOpacity} from 'react-native'
import React from 'react'

const Categories = () => {
    const categories = [
    {
      id: 1,
      name: 'T-Shirts',
     
    },
    {
      id: 2,
      name: 'Jackets',
      
    },
    {
      id: 3,
      name: 'Jeans',
     
    },
    {
      id: 4,
      name: 'Shoese',
     
    },
  ];
  return (
    <>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
        <TouchableOpacity className='flex-row'>
            {categories.map((category) => (
            <View
            key={category.id}
            className="bg-gray-100 p-3 rounded-full mr-3"
            >
            <Text className="text-gray-700">{category.name}</Text>
            </View>
        ))}
        </TouchableOpacity>
    </ScrollView>
    </>
  )
}

export default Categories