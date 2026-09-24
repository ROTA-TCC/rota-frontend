import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const RankCard = ({ rank }: { rank: number }) => (
  <View style={styles.card}>
    <Text style={styles.text}>Currently Rank</Text>
    <View style={styles.value}>
      <Text style={styles.valueText}>{rank}</Text>
      <Ionicons name="chevron-up" size={14} color="#9ED872" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#151517', borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  text: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  value: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  valueText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
