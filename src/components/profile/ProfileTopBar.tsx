import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProfileColors, type ProfilePalette } from '@/constants/profileTheme';
import { FlameIcon, SettingsIcon } from './icons';

interface ProfileTopBarProps {
  experience: number;
  onSettingsPress?: () => void;
}

export function ProfileTopBar({ experience, onSettingsPress }: ProfileTopBarProps) {
  const colors = useProfileColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu perfil</Text>

      <View style={styles.actions}>
        <View
          style={styles.experienceBadge}
          accessible
          accessibilityLabel={`${experience} pontos de experiência`}
        >
          <FlameIcon size={16} color={colors.flame} />
          <Text style={styles.experienceText}>{experience}</Text>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          activeOpacity={0.7}
          onPress={onSettingsPress}
          accessibilityRole="button"
          accessibilityLabel="Configurações"
          testID="profile-settings"
        >
          <SettingsIcon size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ProfilePalette) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingTop: 6,
      paddingBottom: 20,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: -0.3,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    experienceBadge: {
      height: 38,
      paddingHorizontal: 14,
      borderRadius: 19,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    experienceText: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    settingsButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
