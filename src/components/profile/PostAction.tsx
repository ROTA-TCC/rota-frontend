import React, { useMemo, type ComponentType } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useProfileColors, type ProfilePalette } from '@/constants/profileTheme';
import type { IconProps } from './icons';

interface PostActionProps {
  icon: ComponentType<IconProps>;
  count: number;
  label: string;
  onPress?: () => void;
}

export function PostAction({ icon: Icon, count, label, onPress }: PostActionProps) {
  const colors = useProfileColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${count}`}
    >
      <Icon size={16} color={colors.textPrimary} />
      <Text style={styles.count}>{count}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ProfilePalette) =>
  StyleSheet.create({
    container: {
      height: 38,
      paddingHorizontal: 16,
      borderRadius: 18,
      backgroundColor: colors.surfaceElevated,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    count: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
  });
