import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const LeaderboardList = ({ title, items }: { title: string, items: any[] }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
      <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
    </View>
    {items.map((item, index) => (
      <View key={index} style={styles.item}>
        <View style={styles.itemLeft}>
          <View style={[styles.avatar, item.greenBg && styles.greenBg]}>
            <Image source={{ uri: item.image }} style={styles.avatarImg} />
          </View>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sub}>{item.points} points</Text>
          </View>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.rank}>{item.rank}</Text>
          <Ionicons name={item.direction === 'up' ? 'chevron-up' : 'chevron-down'} size={12} color={item.direction === 'up' ? '#9ED872' : '#FF453A'} />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#151517', borderRadius: 20, padding: 20, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2A2A2E' },
  greenBg: { backgroundColor: '#B4D77B' },
  avatarImg: { width: '100%', height: '100%', borderRadius: 22 },
  name: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  sub: { color: '#8E8E93', fontSize: 12, fontWeight: '600' },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rank: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
