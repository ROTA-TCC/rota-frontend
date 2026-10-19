import { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Confetti, type ConfettiRef } from '@/components/leaderboards/Confetti';
import { LeaderboardList, type LeaderboardListItem } from '@/components/leaderboards/LeaderboardList';
import { LeaderboardPodium } from '@/components/leaderboards/LeaderboardPodium';
import { RankCard } from '@/components/leaderboards/RankCard';
import { TopClubsList, type TopClub } from '@/components/leaderboards/TopClubCard';
import { colors, spacing } from '@/theme';

const BEST_RUNNERS: LeaderboardListItem[] = [
  {
    name: 'Ana Silva',
    points: 99,
    rank: 4,
    direction: 'up',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    name: 'Lucas Oliveira',
    points: 85,
    rank: 5,
    direction: 'down',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    greenBg: true,
  },
  {
    name: 'Beatriz Santos',
    points: 84,
    rank: 6,
    direction: 'up',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
  },
];

const TOP_CLUBS: TopClub[] = [
  { name: 'Elite Run Club', members: 1223 },
  { name: 'Sociedade dos Velocistas', members: 950 },
  { name: 'Academia de Maratonistas', members: 820 },
];

export default function LeaderboardsScreen() {
  const confettiRef = useRef<ConfettiRef>(null);

  const handleTriggerConfetti = () => {
    confettiRef.current?.fire();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LeaderboardPodium onTriggerConfetti={handleTriggerConfetti} />
        <RankCard rank={8} />
        <LeaderboardList title="Melhores Corredores" items={BEST_RUNNERS} />
        <TopClubsList title="Clubes de Corrida Top" clubs={TOP_CLUBS} />
      </ScrollView>

      <Confetti ref={confettiRef} count={80} manualstart />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.lg,
    paddingBottom: 100,
  },
});
