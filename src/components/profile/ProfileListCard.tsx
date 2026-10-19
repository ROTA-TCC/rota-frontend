import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { colors, radius, spacing, typography } from '@/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

export interface ProfileListItem {
  icon: IoniconName;
  title: string;
}

interface ProfileListCardProps {
  title: string;
  items: ProfileListItem[];
}

export function ProfileListCard({ title, items }: ProfileListCardProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <View style={styles.card}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            style={[styles.item, index !== items.length - 1 && styles.itemBorder]}
            activeOpacity={0.7}
          >
            <View style={styles.itemLeft}>
              <View style={styles.iconWrapper}>
                <Ionicons name={item.icon} size={20} color={colors.text} />
              </View>
              <ThemedText style={styles.itemText}>{item.title}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.semibold,
    paddingHorizontal: spacing.xs,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xxl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xxl,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: colors.text,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.semibold,
  },
});
