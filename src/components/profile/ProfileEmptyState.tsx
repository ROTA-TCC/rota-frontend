import React, { useMemo, type ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useProfileColors, type ProfilePalette } from '@/constants/profileTheme';
import type { IconProps } from './icons';

interface ProfileEmptyStateProps {
  icon: ComponentType<IconProps>;
  title: string;
  description: string;
}

export function ProfileEmptyState({ icon: Icon, title, description }: ProfileEmptyStateProps) {
  const colors = useProfileColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Icon size={26} color={colors.accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const createStyles = (colors: ProfilePalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 40,
      paddingHorizontal: 24,
      alignItems: 'center',
      gap: 8,
    },
    iconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    description: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },
  });
