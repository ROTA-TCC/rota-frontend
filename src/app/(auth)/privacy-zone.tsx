import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

import { PrivacyHeader } from '../../components/privacy/PrivacyHeader';
import { PrivacyFooter } from '../../components/privacy/PrivacyFooter';
import { PrivacyMapContainer } from '../../components/privacy/PrivacyMapContainer';

const DEFAULT_CENTER: [number, number] = [-23.55052, -46.633308]; // São Paulo Default

export default function PrivacyZoneScreen() {
  const router = useRouter();
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);

  // Solicitar permissão e pegar localização atual do usuário
  const requestUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Permita o acesso à localização para centralizar o mapa na sua posição.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setMapCenter([location.coords.latitude, location.coords.longitude]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização.');
    }
  };

  useEffect(() => {
    requestUserLocation();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
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
          <PrivacyHeader />

          {/* Container do Mapa com Interatividade e Fullscreen */}
          <PrivacyMapContainer
            mapCenter={mapCenter}
            zoom={14}
            onLocateUser={requestUserLocation}
          />

          {/* Ações do Rodapé */}
          <PrivacyFooter
            onComplete={() => router.push('/')}
            onSkip={() => router.push('/')}
          />
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
});
