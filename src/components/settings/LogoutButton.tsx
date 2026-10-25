import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSettingsColors, type SettingsPalette } from '@/constants/settingsTheme';
import { LogoutIcon } from './icons';

interface LogoutButtonProps {
  onPress: () => void;
}

export function LogoutButton({ onPress }: LogoutButtonProps) {
  const colors = useSettingsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Sair"
      testID="logout-button"
    >
      <LogoutIcon size={18} color={colors.logout} />
      <Text style={styles.label}>Sair</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: SettingsPalette) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.screen,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.02,
      shadowRadius: 6,
      elevation: 1,
    },
    label: {
      color: colors.logout,
      fontSize: 15,
      fontWeight: '600',
    },
  });
