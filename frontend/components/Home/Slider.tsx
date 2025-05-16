import { View, Image } from 'react-native'
import React from 'react'
import Swiper from 'react-native-swiper'

const Slider = () => {
  const BannerData = [
    {
      id: 1,
      image: require('../../assets/images/Banner/banner1.png'),
    },
    {
      id: 2,
      image: require('../../assets/images/Banner/banner2.png'),
    },
    {
      id: 3,
      image: require('../../assets/images/Banner/banner3.png'),
    },
  ];

  return (
    <View style={{ height: 180, borderRadius: 10, overflow: 'hidden' }}>
      <Swiper
        autoplay={true}
        loop={true}
        dotColor="#90A4AE"
        activeDotColor="#13274F"
        paginationStyle={{ bottom: 10 }}
      >
        {BannerData.map((item) => (
          <View key={item.id} style={{ flex: 1 }}>
            <Image
              source={item.image}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

export default Slider;
