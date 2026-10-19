import { Image, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { colors, radius, spacing, typography } from '@/theme';

export interface LeaderboardListItem {
  name: string;
  points: number;
  rank: number;
  image: string;
  direction: 'up' | 'down';
  greenBg?: boolean;
}

type LeaderboardListProps = {
  title: string;
  items: LeaderboardListItem[];
};

export function LeaderboardList({ title, items }: LeaderboardListProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>{title}</ThemedText>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
      {items.map((item) => (
        <View key={item.name} style={styles.item}>
          <View style={styles.itemLeft}>
            <View style={[styles.avatar, item.greenBg && styles.greenBg]}>
              <Image source={{ uri: item.image }} style={styles.avatarImg} />
            </View>
            <View>
              <ThemedText style={styles.name}>{item.name}</ThemedText>
              <ThemedText style={styles.sub}>{item.points} pontos</ThemedText>
            </View>
          </View>
          <View style={styles.itemRight}>
            <ThemedText style={styles.rank}>{item.rank}</ThemedText>
            <MaterialCommunityIcons
              name={item.direction === 'up' ? 'chevron-double-up' : 'chevron-double-down'}
              size={18}
              color={item.direction === 'up' ? colors.accentGreen : colors.danger}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    gap: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: colors.text,
    fontSize: typography.sizes.input,
    fontWeight: typography.weights.bold,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
  },
  greenBg: {
    backgroundColor: colors.accentGreenDark,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  name: {
    color: colors.text,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.bold,
  },
  sub: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rank: {
    color: colors.text,
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
  },
});
