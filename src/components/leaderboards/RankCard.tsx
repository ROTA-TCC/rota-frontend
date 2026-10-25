import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLeaderboardsColors, type LeaderboardsPalette } from '@/constants/leaderboardsTheme';

export const RankCard = ({ rank }: { rank: number }) => {
  const colors = useLeaderboardsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.text}>Ranking Atual</Text>
      <View style={styles.value}>
        <Text style={styles.valueText}>{rank}</Text>
        <MaterialCommunityIcons name="chevron-double-up" size={18} color={colors.positive} />
      </View>
    </View>
  );
};

const createStyles = (colors: LeaderboardsPalette) =>
  StyleSheet.create({
    card: { backgroundColor: colors.card, borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    text: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
    value: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    valueText: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  });
