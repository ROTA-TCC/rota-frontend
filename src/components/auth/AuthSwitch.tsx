import React, { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { useAuthTheme } from '@/constants/authTheme';

interface AuthSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
}

const TRACK_WIDTH = 38;
const TRACK_HEIGHT = 22;
const BORDER_WIDTH = 1;
const PADDING = 2;
const THUMB_SIZE = 16;
const TRAVEL = TRACK_WIDTH - BORDER_WIDTH * 2 - PADDING * 2 - THUMB_SIZE;

export function AuthSwitch({ value, onValueChange, accessibilityLabel }: AuthSwitchProps) {
  const theme = useAuthTheme();
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRAVEL],
  });

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.switchTrackOff, theme.switchTrackOn],
  });

  const trackBorderColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.switchBorderOff, theme.switchBorderOn],
  });

  const thumbColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.switchThumbOff, theme.switchThumbOn],
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View
        style={[styles.track, { backgroundColor: trackColor, borderColor: trackBorderColor }]}
      >
        <Animated.View
          style={[styles.thumb, { backgroundColor: thumbColor, transform: [{ translateX }] }]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: BORDER_WIDTH,
    paddingHorizontal: PADDING,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
});
