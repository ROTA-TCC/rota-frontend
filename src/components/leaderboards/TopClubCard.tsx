import { StyleSheet, View } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { colors, radius, spacing, typography } from '@/theme';

export interface TopClub {
  name: string;
  members: number;
}

type TopClubsListProps = {
  title: string;
  clubs: TopClub[];
};

export function TopClubsList({ title, clubs }: TopClubsListProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>{title}</ThemedText>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
      <View style={styles.list}>
        {clubs.map((club, index) => (
          <View
            key={club.name}
            style={[styles.item, index !== clubs.length - 1 && styles.itemSeparator]}
          >
            <View style={styles.itemLeft}>
              <View style={styles.clubIcon}>
                <FontAwesome5 name="sun" size={20} color={colors.primaryBright} />
              </View>
              <View>
                <ThemedText style={styles.name}>{club.name}</ThemedText>
                <View style={styles.clubSub}>
                  <FontAwesome5 name="user" size={10} color={colors.textSecondary} />
                  <ThemedText style={styles.sub}>
                    {club.members.toLocaleString()} membros
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
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
  list: {
    gap: spacing.xl,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xl,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  clubIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceModalAlt,
    justifyContent: 'center',
    alignItems: 'center',
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
  clubSub: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
