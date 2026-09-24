import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LeaderboardPodium } from '@/components/leaderboards/LeaderboardPodium';
import { RankCard } from '@/components/leaderboards/RankCard';
import { LeaderboardList } from '@/components/leaderboards/LeaderboardList';
import { TopClubsList } from '@/components/leaderboards/TopClubCard';

const bestRunners = [
  { name: 'Esther Howard', points: 99, rank: 4, direction: 'up', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { name: 'Kristin Watson', points: 85, rank: 5, direction: 'down', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', greenBg: true },
  { name: 'Cody Fisher', points: 84, rank: 6, direction: 'up', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
];

const topClubs = [
  { name: 'Running Rebels', members: 1223 },
  { name: 'Speedsters Club', members: 950 },
  { name: 'Marathon Masters', members: 820 },
];

export default function LeaderboardsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <LeaderboardPodium />
      <RankCard rank={8} />
      <LeaderboardList title="Best Runners" items={bestRunners} />
      <TopClubsList title="Top Club Running" clubs={topClubs} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 100 },
});
