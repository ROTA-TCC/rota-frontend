import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettingsColors, type SettingsPalette } from '@/constants/settingsTheme';
import { ArrowLeftIcon } from './icons';

interface SettingsTopBarProps {
  title?: string;
  onBack: () => void;
}

export function SettingsTopBar({ title = 'Configurações', onBack }: SettingsTopBarProps) {
  const colors = useSettingsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <ArrowLeftIcon size={20} color={colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.spacer} />
    </View>
  );
}

const createStyles = (colors: SettingsPalette) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 6,
      marginBottom: 20,
    },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.backButton,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: colors.textPrimary,
      fontSize: 17,
      fontWeight: '600',
      letterSpacing: -0.2,
    },
    spacer: {
      width: 38,
    },
  });
