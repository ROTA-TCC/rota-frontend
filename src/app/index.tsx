import { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen() {
  const iconTranslateY = useSharedValue(SCREEN_HEIGHT);
  const iconScale = useSharedValue(3);
  const iconRotate = useSharedValue(20);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    iconTranslateY.value = withTiming(0, { duration: 1500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    iconScale.value = withTiming(1, { duration: 1500 });
    iconRotate.value = withTiming(380, { duration: 1500 });

    logoOpacity.value = withDelay(1500, withTiming(1, { duration: 500 }));

    setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: iconTranslateY.value },
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/brand/rota-logo.png')}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />
      <Animated.Image
        source={require('../../assets/brand/rota-icon.png')}
        style={[styles.icon, iconStyle]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9a00',
  },
  logo: {
    width: 200,
    height: 100,
  },
  icon: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 67,
    },

});
