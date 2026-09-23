import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';

export function RecommendationGrid() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80' }}
        style={styles.greenCard}
        imageStyle={styles.cardImageStyle}
      >
        <LinearGradient
          colors={['#D4ED6D', 'rgba(212, 237, 109, 0.85)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.greenCardContent}>
          <Text style={styles.greenTitle}>Cooling After Run</Text>
          <Text style={styles.greenSubtitle}>
            Top 5 passos para um resfriamento seguro após a corrida
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.rightColumn}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1552674605-171ff3ea36f0?auto=format&fit=crop&w=400&q=80' }}
          style={styles.darkCard}
          imageStyle={styles.cardImageStyle}
        >
          <LinearGradient
            colors={['rgba(21, 21, 21, 0.8)', 'rgba(21, 21, 21, 0.98)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.darkCardTop}>
            <View style={styles.avatarStack}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' }}
                style={[styles.avatar, { zIndex: 3 }]}
              />
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60' }}
                style={[styles.avatar, styles.avatarOverlap, { zIndex: 2 }]}
              />
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' }}
                style={[styles.avatar, styles.avatarOverlap, { zIndex: 1 }]}
              />
            </View>

            <TouchableOpacity style={styles.arrowButton} activeOpacity={0.8}>
              <Ionicons name="trending-up" size={16} color="#111111" />
            </TouchableOpacity>
          </View>

          <View style={styles.darkCardBottomText}>
            <Text style={styles.darkTitle}>Junte-se a nós!</Text>
            <Text style={styles.darkSubtitle}>
              Evolua e crie novas conexões
            </Text>
          </View>
        </ImageBackground>

        <LinearGradient
          colors={['#D86050', '#A3352A']}
          style={styles.redCard}
        >
          <FontAwesome6 name="strava" size={20} color="rgba(255,255,255,0.9)" style={styles.stravaIcon} />
          <View style={styles.redCardContent}>
            <Text style={styles.redTitle}>EM BREVE</Text>
            <Text style={styles.redSubtitle}>Novos recursos e estatísticas avançadas</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    height: 250,
  },
  greenCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 18,
    justifyContent: 'flex-start',
  },
  cardImageStyle: {
    borderRadius: 24,
  },
  greenCardContent: {
    zIndex: 2,
  },
  greenTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 6,
  },
  greenSubtitle: {
    color: '#222222',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  rightColumn: {
    flex: 1,
    gap: 12,
  },
  darkCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'space-between',
  },
  darkCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#151515',
  },
  avatarOverlap: {
    marginLeft: -12,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4ED6D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkCardBottomText: {
    zIndex: 2,
    paddingBottom: 4,
  },
  darkTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  darkSubtitle: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  redCard: {
    flex: 1,
    borderRadius: 24,
    padding: 14,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  stravaIcon: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  redCardContent: {
    zIndex: 2,
  },
  redTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 2,
  },
  redSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 13,
  },
});
