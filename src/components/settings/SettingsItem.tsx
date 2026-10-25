import React, { useMemo, type ComponentType, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettingsColors, type SettingsPalette } from '@/constants/settingsTheme';
import { ChevronRightIcon, type IconProps } from './icons';

interface SettingsItemProps {
  icon: ComponentType<IconProps>;
  label: string;
  onPress?: () => void;
  trailing?: ReactNode;
  showChevron?: boolean;
}

export function SettingsItem({
  icon: Icon,
  label,
  onPress,
  trailing,
  showChevron = true,
}: SettingsItemProps) {
  const colors = useSettingsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const content = (
    <>
      <View style={styles.left}>
        <Icon size={20} color={colors.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>

      {trailing ?? (showChevron && <ChevronRightIcon size={18} color={colors.chevron} />)}
    </>
  );

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
    >
      {content}
    </TouchableOpacity>
  );
}

const createStyles = (colors: SettingsPalette) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    label: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '500',
    },
  });
