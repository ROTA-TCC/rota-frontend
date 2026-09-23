import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';

export function RecommendationGrid() {
  return (
    <View style={styles.container}>
      {/* Card da Esquerda: Cooling After Run (Destaque Verde Lime) */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80' }}
        style={styles.greenCard}
        imageStyle={styles.cardImageStyle}
      >
        <LinearGradient
          colors={['#D4ED6D', 'rgba(212, 237, 109, 0.92)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.greenCardContent}>
          <View style={styles.greenBadge}>
            <Text style={styles.greenBadgeText}>RECOMENDADO</Text>
          </View>
          <Text style={styles.greenTitle}>Cooling After Run</Text>
          <Text style={styles.greenSubtitle}>
            Top 5 passos para um resfriamento seguro após a corrida
          </Text>
        </View>

        <TouchableOpacity style={styles.greenCardButton} activeOpacity={0.8}>
          <Text style={styles.greenCardButtonText}>Ver guia</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Coluna da Direita */}
      <View style={styles.rightColumn}>
        {/* Card Superior Direita: Join With Us */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1552674605-171ff3ea36f0?auto=format&fit=crop&w=400&q=80' }}
          style={styles.darkCard}
          imageStyle={styles.cardImageStyle}
        >
          <LinearGradient
            colors={['rgba(21, 21, 21, 0.75)', 'rgba(21, 21, 21, 0.95)']}
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
            <Text style={styles.darkSubtitle}>Evolua e crie conexões</Text>
          </View>
        </ImageBackground>

        {/* Card Inferior Direita: Em Breve COM Imagem de Fundo + Overlay Vermelho */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=80' }}
          style={styles.redCard}
          imageStyle={styles.cardImageStyle}
        >
          <LinearGradient
            colors={['rgba(216, 96, 80, 0.82)', 'rgba(163, 53, 42, 0.94)']}
            style={StyleSheet.absoluteFillObject}
          />
          <FontAwesome6 name="strava" size={18} color="#FFFFFF" style={styles.stravaIcon} />
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
  /* Card Verde */
  greenCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 16,
    justifyContent: 'space-between',
  },
  greenCardContent: {
    zIndex: 2,
  },
  greenBadge: {
    backgroundColor: 'rgba(17, 17, 17, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  greenBadgeText: {
    color: '#111111',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  greenTitle: {
    color: '#111111',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 23,
    marginBottom: 6,
  },
  greenSubtitle: {
    color: '#222222',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  greenCardButton: {
    zIndex: 2,
    backgroundColor: '#111111',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greenCardButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  /* Coluna Direita */
  rightColumn: {
    flex: 1,
    gap: 12,
  },
  /* Card Escuro */
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
  /* Card Vermelho com Imagem */
  redCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 14,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  stravaIcon: {
    position: 'absolute',
    top: 14,
    left: 14,
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
x
