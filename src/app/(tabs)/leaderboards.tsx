import React, { useMemo, useRef } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LeaderboardPodium } from '@/components/leaderboards/LeaderboardPodium';
import { RankCard } from '@/components/leaderboards/RankCard';
import { LeaderboardList } from '@/components/leaderboards/LeaderboardList';
import { TopClubsList } from '@/components/leaderboards/TopClubCard';
import { Confetti, ConfettiRef } from '@/components/leaderboards/Confetti';
import { useLeaderboardsColors, type LeaderboardsPalette } from '@/constants/leaderboardsTheme';

const bestRunners = [
  { name: 'Ana Silva', points: 99, rank: 4, direction: 'up', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { name: 'Lucas Oliveira', points: 85, rank: 5, direction: 'down', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', greenBg: true },
  { name: 'Beatriz Santos', points: 84, rank: 6, direction: 'up', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
];

const topClubs = [
  { name: 'Elite Run Club', members: 1223 },
  { name: 'Sociedade dos Velocistas', members: 950 },
  { name: 'Academia de Maratonistas', members: 820 },
];

export default function LeaderboardsScreen() {
  const router = useRouter();
  const confettiRef = useRef<ConfettiRef>(null);
  const colors = useLeaderboardsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleTriggerConfetti = () => {
    confettiRef.current?.fire();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LeaderboardPodium onTriggerConfetti={handleTriggerConfetti} />
        <RankCard rank={8} />
        <LeaderboardList
          title="Melhores Corredores"
          items={bestRunners}
          onPress={() => router.push('/best-runners')}
        />
        <TopClubsList
          title="Clubes de Corrida Top"
          clubs={topClubs}
          onPress={() => router.push('/clubs')}
        />
      </ScrollView>

      <Confetti ref={confettiRef} count={80} manualstart={true} />
    </View>
  );
}

const createStyles = (colors: LeaderboardsPalette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 16, gap: 12, paddingBottom: 100 },
  });
