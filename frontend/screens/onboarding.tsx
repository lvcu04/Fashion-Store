import { View, Text, Image, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { router, useNavigation } from 'expo-router';
import Onboarding from 'react-native-onboarding-swiper';

type Props = {};


const OnboardingScreen = (props: Props) => {
  const Done = ({...props}) => (
 <TouchableOpacity
  className="mr-2 mb-1 px-2.5 py-2 rounded-full bg-black"
  {...props}
>
  <Text className="text-white">Get Started</Text>
</TouchableOpacity>
);
  const handleDone = () => {
    router.push('./(auth)/login');
  };
  return (
    <View className="flex-1">
      <Onboarding
      onSkip={handleDone} //khi skip hoặc done go to home
        onDone={handleDone}
        DoneButtonComponent={Done}
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <View className="relative w-full h-full mt-11">
                <Image
                  source={require('../assets/images/Onboarding/Onboarding01.jpg')}
                  className="w-full h-[700px]  object-cover"
                />
                 <Text className="absolute top-[420px] rotate-45 left-[10px] text-black font-extralight italic text-[20px] tracking-tight">
                  Fashion Style
                </Text>

              </View>
            ),
             title: "",
              subtitle: "",  
          },
          {
            backgroundColor: '#fff',
            image: (
              <View className="relative w-full h-full mt-11">
                <Image
                  source={require('../assets/images/Onboarding/Onboarding02.jpg')}
                  className="w-full h-full object-cover"
                />
                  <Text className="absolute top-[200px] left-[90px] text-white text-3xl font-semibold rotate-45 tracking-wider">
                  Life Style
                </Text>
              </View>
            ),
              title: "",
              subtitle: "",  
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('../assets/images/Onboarding/Onboarding03.jpg')} 
            className="w-full h-full object-cover mt-11" 
            />,
            title: "",
            subtitle: "",
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;

type SplashTypes = {
  title: string;
  description: string;
};
const SplashData: SplashTypes[] = [
  {
    title: 'Choose Products',
    description:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
  },
  {
    title: 'Make Payment',
    description:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
  },
  {
    title: 'Get Your Order',
    description:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
  },
];
