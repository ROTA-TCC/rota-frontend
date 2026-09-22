import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

const ORANGE = '#FF8C00';

export default function PrivacyZoneScreen() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Glow de Fundo */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image
            source={require('../../../assets/images/background-blur.png')}
            style={[styles.glowImage, styles.topGlow]}
            resizeMode="cover"
          />
          <Image
            source={require('../../../assets/images/background-blur.png')}
            style={[styles.glowImage, styles.bottomGlow]}
            resizeMode="cover"
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.progressBar}>
              <View style={styles.step} />
              <View style={styles.step} />
              <View style={[styles.step, styles.activeStep]} />
            </View>

            <Text style={styles.subtitle}>Privacidade</Text>
            <Text style={styles.title}>Ocultar região</Text>
            <Text style={styles.description}>
              Defina uma área no mapa para manter suas atividades privadas. Trajetos iniciados ou finalizados dentro desta zona não serão exibidos publicamente.
            </Text>
          </View>

          {/* Card do Mapa com Zona de Seleção */}
          <View style={styles.mapWrapper}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
              }}
              style={styles.mapCard}
              imageStyle={styles.mapImageStyle}
            >
              {/* Overlay Escuro para Contraste */}
              <View style={styles.mapOverlay} />

              {/* Pill Superior do Mapa */}
              <View style={styles.infoPill}>
                <Text style={styles.infoPillText}>Área Oculta</Text>
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="12" r="10" stroke={ORANGE} strokeWidth="2" />
                  <Path
                    d="M12 16V12M12 8H12.01"
                    stroke={ORANGE}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </Svg>
              </View>

              {/* Círculo Interativo de Seleção de Zona */}
              <View style={styles.interactiveZone}>
                <View style={[styles.zoneAnchor, styles.anchorTop]} />
                <View style={[styles.zoneAnchor, styles.anchorBottom]} />
                <View style={[styles.zoneAnchor, styles.anchorLeft]} />
                <View style={[styles.zoneAnchor, styles.anchorRight]} />
                <View style={styles.zoneCenter} />
              </View>
            </ImageBackground>
          </View>

          {/* Botões do Rodapé */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnNext}
              onPress={() => router.push('/')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnNextText}>Concluir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSkip}
              onPress={() => router.push('/')}
              activeOpacity={0.7}
            >
              <Text style={styles.btnSkipText}>Pular</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070707',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  glowImage: {
    position: 'absolute',
    width: 320,
    height: 320,
    opacity: 0.35,
  },
  topGlow: {
    top: -80,
    right: -80,
  },
  bottomGlow: {
    bottom: -80,
    left: -80,
    transform: [{ rotate: '180deg' }],
  },
  header: {
    marginBottom: 16,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  step: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#2A2A2D',
    width: 12,
  },
  activeStep: {
    width: 24,
    backgroundColor: ORANGE,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 4,
    color: ORANGE,
  },
  title: {
    marginBottom: 12,
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  mapWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 28,
    overflow: 'hidden',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#1F1F22',
  },
  mapCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImageStyle: {
    opacity: 0.75,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 7, 7, 0.45)',
  },
  infoPill: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: '#141416',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  infoPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  interactiveZone: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255, 140, 0, 0.15)',
    borderWidth: 1.5,
    borderColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  zoneAnchor: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  anchorTop: {
    top: -4,
  },
  anchorBottom: {
    bottom: -4,
  },
  anchorLeft: {
    left: -4,
  },
  anchorRight: {
    right: -4,
  },
  zoneCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ORANGE,
    borderWidth: 2,
    borderColor: '#070707',
  },
  footer: {
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
  },
  btnNext: {
    backgroundColor: ORANGE,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  btnNextText: {
    color: '#0A0F09',
    fontWeight: '700',
    fontSize: 15,
  },
  btnSkip: {
    padding: 6,
  },
  btnSkipText: {
    color: ORANGE,
    fontWeight: '600',
    fontSize: 14,
  },
});
