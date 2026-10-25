import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettingsColors, type SettingsPalette } from '@/constants/settingsTheme';
import { ChevronRightIcon } from './icons';

interface SettingsProfileCardProps {
  name: string;
  username: string;
  avatarUrl: string;
  onPress?: () => void;
}

export function SettingsProfileCard({
  name,
  username,
  avatarUrl,
  onPress,
}: SettingsProfileCardProps) {
  const colors = useSettingsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${name}, ${username}`}
    >
      <View style={styles.left}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
        <View style={styles.names}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
      </View>

      <ChevronRightIcon size={18} color={colors.chevron} />
    </TouchableOpacity>
  );
}

const createStyles = (colors: SettingsPalette) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
    },
    names: {
      gap: 2,
    },
    name: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    username: {
      color: colors.textSecondary,
      fontSize: 13,
    },
  });
