import React, { useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useExploreColors, type ExplorePalette } from '@/constants/exploreTheme';
import { BellIcon, LogoMarkIcon, PersonIcon } from './icons';

interface ExploreHeaderProps {
  avatarUrl?: string;
  onAvatarPress?: () => void;
  onNotificationsPress?: () => void;
}

export function ExploreHeader({
  avatarUrl,
  onAvatarPress,
  onNotificationsPress,
}: ExploreHeaderProps) {
  const colors = useExploreColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.logoCapsule}>
        <LogoMarkIcon color={colors.textPrimary} />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={onNotificationsPress}
          disabled={!onNotificationsPress}
          accessibilityRole="button"
          accessibilityLabel="Notificações"
        >
          <BellIcon size={16} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.avatar}
          activeOpacity={0.8}
          onPress={onAvatarPress}
          disabled={!onAvatarPress}
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil"
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} resizeMode="cover" />
          ) : (
            <PersonIcon size={20} color={colors.textStoryIcon} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ExplorePalette) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 4,
    },
    logoCapsule: {
      width: 48,
      height: 26,
      borderRadius: 13,
      borderWidth: 1.5,
      borderColor: colors.borderCapsule,
      backgroundColor: colors.capsule,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    iconButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      overflow: 'hidden',
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
  });
