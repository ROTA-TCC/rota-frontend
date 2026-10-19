import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen() {
  const iconTranslateY = useSharedValue(SCREEN_HEIGHT);
  const iconScale = useSharedValue(3);
  const iconRotate = useSharedValue(20);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    iconTranslateY.set(withTiming(0, { duration: 1500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));
    iconScale.set(withTiming(1, { duration: 1500 }));
    iconRotate.set(withTiming(380, { duration: 1500 }));

    logoOpacity.set(withDelay(1500, withTiming(1, { duration: 500 })));

    const timeout = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2500);

    return () => clearTimeout(timeout);
  }, [iconTranslateY, iconScale, iconRotate, logoOpacity]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: iconTranslateY.get() },
      { scale: iconScale.get() },
      { rotate: `${iconRotate.get()}deg` },
    ],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.get(),
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
    backgroundColor: colors.primaryTint,
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
