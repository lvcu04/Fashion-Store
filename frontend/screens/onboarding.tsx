import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const OnBoarding = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<Swiper>(null);

  const handleNext = () => {
    if (swiperRef.current && currentIndex < 4) {
      swiperRef.current.scrollBy(1);
    }
  };

  const handlePrev = () => {
    if (swiperRef.current && currentIndex > 0) {
      swiperRef.current.scrollBy(-1);
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/login'); // Adjust the route as needed
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <Swiper
          loop={false}
          showsPagination={false}
          onIndexChanged={(index) => setCurrentIndex(index)}
          ref={swiperRef}
        >
          {/* Slide 1 - Splash Screen */}
          <View style={styles.darkSlide}>
            <Image
              source={require('../assets/images/Onboarding/Onboarding07.webp')}
              style={styles.fullscreenImage}
              resizeMode="cover"
            />
            <View style={styles.darkOverlay} />
            <View style={styles.contentContainer}>
              {/* Logo */}
      <View className="items-center mb-6">
        <Text
          style={{
            fontFamily: 'GreatVibes',
            fontSize: 60,
            color: '#F8F8FF',
          }}
        >
          Fashions
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: '#F8F8FF',
            fontStyle: 'italic',
            marginTop: -30,
           
            marginLeft: 50,
          }}
        >
          My Life My Style
        </Text>
      </View>
            </View>
          </View>

          {/* Slide 2 - Login/Signup Screen */}
          <View style={styles.darkSlide}>
            <Image
              source={require('../assets/images/Onboarding/Onboarding01.webp')}
              style={styles.fullscreenImage}
              resizeMode="cover"
            />
            <View style={styles.darkOverlay} />
            <View style={styles.contentContainer}>
              <View className="items-center mb-6">
        <Text
          style={{
            fontFamily: 'GreatVibes',
            fontSize: 60,
            color: '#F8F8FF',
          }}
        >
          Fashions
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: '#F8F8FF',
            fontStyle: 'italic',
            marginTop: -30,
            marginLeft: 50,
          }}
        >
          My Life My Style
        </Text>
      </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => router.push('/(auth)/register')}
                >
                  <Text style={styles.signupButtonText}>SIGN UP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Slide 3 - 20% Discount */}
          <View style={styles.lightSlide}>
            <View style={styles.safeHeaderArea}>
              <View style={styles.headerControls}>
                <Text style={styles.pageIndicator}>{`${currentIndex - 1}/3`}</Text>
                <TouchableOpacity onPress={handleSkip}>
                  <Text style={styles.skipButton}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.modernCardContainer}>
              <Image
                source={require('../assets/images/Onboarding/Onboarding02.jpg')}
                style={styles.modernCardImage}
                resizeMode="cover"
              />
              <View style={styles.contentBox}>
                <Text style={styles.modernCardTitle}>20% Discount</Text>
                <Text style={styles.modernCardSubtitle}>New Arrival Product</Text>
                <Text style={styles.modernCardDescription}>
                  Publish up your selfies to make yourself more beautiful with this app.
                </Text>
              </View>
              <View style={styles.bottomControls}>
                <TouchableOpacity onPress={handlePrev}>
                  <Text style={styles.prevButton}>PREV</Text>
                </TouchableOpacity>
                <View style={styles.paginationContainer}>
                  <View style={currentIndex === 2 ? styles.activePaginationDot : styles.paginationDot} />
                  <View style={currentIndex === 3 ? styles.activePaginationDot : styles.paginationDot} />
                  <View style={currentIndex === 4 ? styles.activePaginationDot : styles.paginationDot} />
                </View>
                <TouchableOpacity style={styles.modernNextButton} onPress={handleNext}>
                  <Text style={styles.arrowSymbol}>➜</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Slide 4 - Take Advantage */}
          <View style={styles.lightSlide}>
            <View style={styles.safeHeaderArea}>
              <View style={styles.headerControls}>
                <Text style={styles.pageIndicator}>{`${currentIndex - 1}/3`}</Text>
                <TouchableOpacity onPress={handleSkip}>
                  <Text style={styles.skipButton}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.modernCardContainer}>
              <Image
                source={require('../assets/images/Onboarding/Onboarding03.jpg')}
                style={styles.modernCardImage}
                resizeMode="cover"
              />
              <View style={styles.contentBox}>
                <Text style={styles.modernCardTitle}>Take Advantage</Text>
                <Text style={styles.modernCardSubtitle}>Of The Offer Shopping</Text>
                <Text style={styles.modernCardDescription}>
                  Publish up your selfies to make yourself more beautiful with this app.
                </Text>
              </View>
              <View style={styles.bottomControls}>
                <TouchableOpacity onPress={handlePrev}>
                  <Text style={styles.prevButton}>PREV</Text>
                </TouchableOpacity>
                <View style={styles.paginationContainer}>
                  <View style={currentIndex === 2 ? styles.activePaginationDot : styles.paginationDot} />
                  <View style={currentIndex === 3 ? styles.activePaginationDot : styles.paginationDot} />
                  <View style={currentIndex === 4 ? styles.activePaginationDot : styles.paginationDot} />
                </View>
                <TouchableOpacity style={styles.modernNextButton} onPress={handleNext}>
                  <Text style={styles.arrowSymbol}>➜</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Slide 5 - All Types Offers */}
          <View style={styles.lightSlide}>
            <View style={styles.safeHeaderArea}>
              <View style={styles.headerControls}>
                <Text style={styles.pageIndicator}>{`${currentIndex - 1}/3`}</Text>
                <TouchableOpacity onPress={handleSkip}>
                  <Text style={styles.skipButton}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.modernCardContainer}>
              <Image
                source={require('../assets/images/Onboarding/Onboarding06.jpg')}
                style={styles.modernCardImage}
                resizeMode="cover"
              />
              <View style={styles.contentBox}>
                <Text style={styles.modernCardTitle}>All Types Offers</Text>
                <Text style={styles.modernCardSubtitle}>Within Your Reach</Text>
                <Text style={styles.modernCardDescription}>
                  Publish up your selfies to make yourself more beautiful with this app.
                </Text>
              </View>
              <View style={styles.bottomControls}>
                <TouchableOpacity onPress={handlePrev}>
                  <Text style={styles.prevButton}>PREV</Text>
                </TouchableOpacity>
                <View style={styles.paginationContainer}>
                  <View style={currentIndex === 2 ? styles.activePaginationDot : styles.paginationDot} />
                  <View style={currentIndex === 3 ? styles.activePaginationDot : styles.paginationDot} />
                  <View style={currentIndex === 4 ? styles.activePaginationDot : styles.paginationDot} />
                </View>
                <TouchableOpacity style={styles.modernNextButton} onPress={handleNext}>
                  <Text style={styles.arrowSymbol}>➜</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Swiper>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkSlide: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: '10%',
  },
  brandText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'serif',
  },
  taglineText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    fontFamily: 'serif',
  },
 buttonContainer: {
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16, // nếu RN hỗ trợ
  marginTop: 20,
},
loginButton: {
  backgroundColor: '#fff',
  paddingVertical: 12,
  paddingHorizontal: 40,
  borderRadius: 30,
  width: 200,
  alignItems: 'center',
},
  loginButtonText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
 signupButton: {
  borderWidth: 1,
  borderColor: '#fff',
  paddingVertical: 12,
  paddingHorizontal: 40,
  borderRadius: 30,
  width: 200,
  marginTop: 0,
  alignItems: 'center',
},
  signupButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  lightSlide: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeHeaderArea: {
    paddingTop: 50, // Added safe area for status bar
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 0,
    height: 30,
  },
  pageIndicator: {
    fontSize: 16,
    color: '#888',
  },
  skipButton: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  modernCardContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10, // Adjusted to account for the header area
  },
  modernCardImage: {
    width: '100%',
    height: '70%', // Reduced height to fit in the screen
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  contentBox: {
    width: '100%',
    paddingHorizontal: 25,
    paddingTop: 20,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  modernCardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 38,
  },
  modernCardSubtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    lineHeight: 38,
  },
  modernCardDescription: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
    lineHeight: 22,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  prevButton: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginRight: 5,
  },
  activePaginationDot: {
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginRight: 5,
  },
  modernNextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowSymbol: {
    color: '#fff',
    fontSize: 20,
  },
});

export default OnBoarding;
