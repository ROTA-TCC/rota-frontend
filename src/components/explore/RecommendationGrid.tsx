import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function RecommendationGrid() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/fundo-verde-com-imagem-quadrado.png')}
        style={styles.greenCard}
        imageStyle={styles.cardImageStyle}
      >
        <View style={styles.greenCardContent}>
          <Text style={styles.greenTitle}>Resfriamento Pós-Corrida</Text>
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
            <Text style={styles.darkSubtitle}>Evolua e crie conexões</Text>
          </View>
        </ImageBackground>

        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=80' }}
          style={styles.redCard}
          imageStyle={styles.cardImageStyle}
        >
          <Image
            source={require('../../../assets/brand/logo-sem-fundo.png')}
            style={styles.brandIcon}
            resizeMode="contain"
          />
          <View style={styles.redCardContent}>
            <Text style={styles.redTitle}>EM BREVE</Text>
            <Text style={styles.redSubtitle}>Novos recursos e estatísticas</Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    height: 260,
  },
  cardImageStyle: {
    borderRadius: 24,
  },
  greenCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
    justifyContent: 'flex-start',
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
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  greenSubtitle: {
    color: '#222222',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#151515',
  },
  avatarOverlap: {
    marginLeft: -10,
  },
  arrowButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D4ED6D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkCardBottomText: {
    zIndex: 2,
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
  },
  redCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 14,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  brandIcon: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 28,
    height: 28,
    zIndex: 2,
  },
  redCardContent: {
    zIndex: 2,
  },
  redTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  redSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '500',
  },
});