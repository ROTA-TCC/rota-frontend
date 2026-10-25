import React, { useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettingsColors, type SettingsPalette } from '@/constants/settingsTheme';

interface SettingsToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingsToggle({ value, onValueChange }: SettingsToggleProps) {
  const colors = useSettingsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [offset] = useState(() => new Animated.Value(value ? 22 : 0));

  useEffect(() => {
    Animated.timing(offset, {
      toValue: value ? 22 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [offset, value]);

  return (
    <TouchableOpacity
      style={[
        styles.track,
        { backgroundColor: value ? colors.toggleActive : colors.toggleInactive },
      ]}
      activeOpacity={0.9}
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View style={[styles.thumb, { transform: [{ translateX: offset }] }]} />
    </TouchableOpacity>
  );
}

const createStyles = (colors: SettingsPalette) =>
  StyleSheet.create({
    track: {
      width: 50,
      height: 28,
      borderRadius: 14,
      padding: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    thumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.toggleHandle,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 2.5,
      elevation: 2,
    },
  });
