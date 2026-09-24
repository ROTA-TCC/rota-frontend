import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const LeaderboardPodium = () => (
  <View style={styles.card}>
    <Text style={styles.title}>Leaderboards</Text>
    <Text style={styles.subtitle}>November 2023</Text>
    
    <View style={styles.podiumContainer}>
      <PodiumCol rank={2} name="James Grant" points="125 pt" image="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=80" />
      <PodiumCol rank={1} name="Samantha" points="250 pt" image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" isFirst />
      <PodiumCol rank={3} name="Josh Nathan" points="100 pt" image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" />
    </View>
  </View>
);

const PodiumCol = ({ rank, name, points, image, isFirst }: any) => (
  <View style={[styles.podiumCol, isFirst && styles.first]}>
    <View style={[styles.awardIcon, rank === 1 ? styles.trophy : styles.star]}>
      {rank === 1 ? <Ionicons name="trophy" size={24} color="#FFD700" /> : <Ionicons name="star-outline" size={20} color={rank === 2 ? '#C0C0C0' : '#CD7F32'} />}
      {rank !== 1 && <Text style={styles.rankNum}>{rank}</Text>}
    </View>
    <View style={styles.avatarRing}>
      <Image source={{ uri: image }} style={styles.avatarImg} />
    </View>
    <Text style={styles.userName}>{name}</Text>
    <Text style={styles.userPts}>{points}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#151517', borderRadius: 24, padding: 24, alignItems: 'center' },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#8E8E93', fontSize: 12, fontWeight: '600', marginBottom: 32 },
  podiumContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 20 },
  podiumCol: { alignItems: 'center' },
  first: { marginBottom: 20 },
  awardIcon: { marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  rankNum: { position: 'absolute', fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  avatarRing: { width: 64, height: 64, borderRadius: 32, marginBottom: 12 },
  avatarImg: { width: '100%', height: '100%', borderRadius: 32 },
  userName: { color: '#9ED872', fontSize: 12, fontWeight: '700' },
  userPts: { color: '#8E8E93', fontSize: 11, fontWeight: '600' },
});
