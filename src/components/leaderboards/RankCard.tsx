import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { colors, radius, spacing, typography } from '@/theme';

type RankCardProps = {
  rank: number;
};

export function RankCard({ rank }: RankCardProps) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.text}>Ranking Atual</ThemedText>
      <View style={styles.value}>
        <ThemedText style={styles.valueText}>{rank}</ThemedText>
        <MaterialCommunityIcons name="chevron-double-up" size={18} color={colors.accentGreen} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: colors.text,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.bold,
  },
  value: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  valueText: {
    color: colors.text,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.bold,
  },
});
