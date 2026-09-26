import React, { useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Confetti, ConfettiRef } from './Confetti';

export const LeaderboardPodium = () => {
  const confettiRef = useRef<ConfettiRef>(null);

  const handleTriggerConfetti = () => {
    confettiRef.current?.fire();
  };

  return (
    <View style={styles.card}>
      <Confetti ref={confettiRef} count={60} manualstart={false} />

      <Text style={styles.title}>Leaderboards</Text>
      <Text style={styles.subtitle}>November 2023</Text>

      <View style={styles.podiumContainer}>
        <PodiumCol
          rank={2}
          name="James Grant"
          points="125 pt"
          image="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=80"
        />
        <PodiumCol
          rank={1}
          name="Samantha"
          points="250 pt"
          image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
          isFirst
          onPress={handleTriggerConfetti}
        />
        <PodiumCol
          rank={3}
          name="Josh Nathan"
          points="100 pt"
          image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
        />
      </View>
    </View>
  );
};

const PodiumCol = ({ rank, name, points, image, isFirst, onPress }: any) => (
  <TouchableOpacity
    activeOpacity={isFirst ? 0.8 : 1}
    onPress={onPress}
    style={[styles.podiumCol, isFirst && styles.first]}
  >
    <View style={[styles.awardIcon, rank === 1 ? styles.trophy : styles.star]}>
      {rank === 1 ? (
        <FontAwesome5 name="trophy" size={20} color="#FFD700" />
      ) : (
        <FontAwesome5
          name="star"
          size={20}
          color={rank === 2 ? '#C0C0C0' : '#CD7F32'}
        />
      )}
      {rank !== 1 && <Text style={styles.rankNum}>{rank}</Text>}
    </View>
    <View style={styles.avatarRing}>
      <Image source={{ uri: image }} style={styles.avatarImg} />
    </View>
    <Text style={styles.userName}>{name}</Text>
    <Text style={styles.userPts}>{points}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#151517',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#8E8E93', fontSize: 12, fontWeight: '600', marginBottom: 32 },
  podiumContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 20 },
  podiumCol: { alignItems: 'center' },
  first: { marginBottom: 20 },
  awardIcon: { marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  star: { position: 'relative' },
  trophy: {},
  rankNum: { position: 'absolute', fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#151517',
  },
  avatarImg: { width: '100%', height: '100%', borderRadius: 32 },
  userName: { color: '#9ED872', fontSize: 12, fontWeight: '700', marginBottom: 2 },
  userPts: { color: '#8E8E93', fontSize: 11, fontWeight: '600' },
});