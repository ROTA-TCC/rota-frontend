import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useProfileColors, type ProfilePalette } from '@/constants/profileTheme';
import { VerifiedIcon } from './icons';

interface ProfileHeaderProps {
  name: string;
  avatarUrl: string;
  followers: number;
  following: number;
  verified?: boolean;
}

function formatCompactNumber(value: number) {
  if (value < 1000) {
    return String(value);
  }

  const compact = value / 1000;
  const formatted = Number.isInteger(compact)
    ? String(compact)
    : compact.toFixed(1).replace('.', ',');

  return `${formatted}k`;
}

export function ProfileHeader({
  name,
  avatarUrl,
  followers,
  following,
  verified = false,
}: ProfileHeaderProps) {
  const colors = useProfileColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const stats = `${formatCompactNumber(followers)} seguidores · ${formatCompactNumber(following)} seguindo`;

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
      </View>

      <View style={styles.nameRow}>
        <Text style={styles.name}>{name}</Text>
        {verified && (
          <View style={styles.verifiedBadge} accessibilityLabel="Perfil verificado">
            <VerifiedIcon size={12} color={colors.accentText} />
          </View>
        )}
      </View>

      <Text style={styles.stats}>{stats}</Text>
    </View>
  );
}

const createStyles = (colors: ProfilePalette) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: 22,
    },
    avatarWrapper: {
      width: 90,
      height: 90,
      borderRadius: 45,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: colors.surface,
      marginBottom: 12,
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    name: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '700',
    },
    verifiedBadge: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stats: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '400',
    },
  });
