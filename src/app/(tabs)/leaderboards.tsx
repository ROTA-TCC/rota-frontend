import React, { useRef } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { LeaderboardPodium } from '@/components/leaderboards/LeaderboardPodium';
import { RankCard } from '@/components/leaderboards/RankCard';
import { LeaderboardList } from '@/components/leaderboards/LeaderboardList';
import { TopClubsList } from '@/components/leaderboards/TopClubCard';
import { Confetti, ConfettiRef } from '@/components/leaderboards/Confetti';

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
  const confettiRef = useRef<ConfettiRef>(null);

  const handleTriggerConfetti = () => {
    confettiRef.current?.fire();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LeaderboardPodium onTriggerConfetti={handleTriggerConfetti} />
        <RankCard rank={8} />
        <LeaderboardList title="Melhores Corredores" items={bestRunners} />
        <TopClubsList title="Clubes de Corrida Top" clubs={topClubs} />
      </ScrollView>

      <Confetti ref={confettiRef} count={80} manualstart={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 100 },
});