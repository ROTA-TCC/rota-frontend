import { StyleSheet, View } from 'react-native';

import { PodiumColumn } from '@/components/leaderboards/PodiumColumn';
import { DEFAULT_PODIUM, type PodiumEntry } from '@/components/leaderboards/podiumData';
import { ThemedText } from '@/components/themed-text';
import { colors, radius, spacing, typography } from '@/theme';

type LeaderboardPodiumProps = {
  entries?: PodiumEntry[];
  periodLabel?: string;
  onTriggerConfetti?: () => void;
};

export function LeaderboardPodium({
  entries = DEFAULT_PODIUM,
  periodLabel = 'Novembro 2023',
  onTriggerConfetti,
}: LeaderboardPodiumProps) {
  const [first, second, third] = entries;

  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>Classificações</ThemedText>
      <ThemedText style={styles.subtitle}>{periodLabel}</ThemedText>

      <View style={styles.podiumContainer}>
        {second && (
          <PodiumColumn
            rank={2}
            name={second.name}
            points={second.points}
            image={second.image}
          />
        )}
        {first && (
          <PodiumColumn
            rank={1}
            name={first.name}
            points={first.points}
            image={first.image}
            isFirst
            onPress={onTriggerConfetti}
          />
        )}
        {third && (
          <PodiumColumn
            rank={3}
            name={third.name}
            points={third.points}
            image={third.image}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xxl,
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xxl,
    marginTop: spacing.xxxl,
  },
});
