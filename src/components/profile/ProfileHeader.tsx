import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { colors, spacing, typography } from '@/theme';

const AVATAR_URI =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80';

export function ProfileHeader() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.avatarWrapper}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Alterar foto de perfil"
      >
        <Image source={{ uri: AVATAR_URI }} style={styles.avatar} />
        <View style={styles.cameraIconWrapper}>
          <Ionicons name="camera" size={16} color={colors.background} />
        </View>
      </TouchableOpacity>

      <ThemedText style={styles.name}>Ana Silva</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.lg,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 60,
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: colors.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    color: colors.text,
    fontSize: typography.sizes.headline,
    fontWeight: typography.weights.heavy,
  },
});
