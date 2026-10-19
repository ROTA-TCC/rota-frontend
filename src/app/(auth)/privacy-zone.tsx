import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

import { OnboardingFooter } from '@/components/auth/OnboardingFooter';
import { PrivacyHeader } from '@/components/privacy/PrivacyHeader';
import { PrivacyMapContainer } from '@/components/privacy/PrivacyMapContainer';
import { GlowBackground } from '@/components/ui/GlowBackground';
import { useProfileSetup } from '@/providers/ProfileSetupProvider';
import { updateProfile } from '@/services/api/profileService';
import { colors, spacing } from '@/theme';

const DEFAULT_CENTER: [number, number] = [-23.55052, -46.633308];

export default function PrivacyZoneScreen() {
  const router = useRouter();
  const { profileData, resetProfileData } = useProfileSetup();
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [radiusMeters, setRadiusMeters] = useState(70);

  const handleComplete = async () => {
    try {
      await updateProfile({
        ...profileData,
        mapaOcultacao: {
          latitude: mapCenter[0],
          longitude: mapCenter[1],
          radiusMetres: radiusMeters,
        },
      });
      resetProfileData();
      router.replace('/(tabs)/explore');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar sua área de privacidade.');
    }
  };

  const requestUserLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Permita a localização para centralizar o mapa na sua posição.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setMapCenter([location.coords.latitude, location.coords.longitude]);
    } catch {
      Alert.alert('Erro', 'Não foi possível obter sua localização.');
    }
  }, []);

  useEffect(() => {
    // Busca assíncrona de localização: setState ocorre apenas nos callbacks do fluxo
    // eslint-disable-next-line react-hooks/set-state-in-effect
    requestUserLocation();
  }, [requestUserLocation]);

  const handleSkip = () => {
    resetProfileData();
    router.push('/');
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <GlowBackground offset={80} opacity={0.35} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <PrivacyHeader />

          <PrivacyMapContainer
            mapCenter={mapCenter}
            zoom={14}
            onLocateUser={requestUserLocation}
            onRadiusMetersChange={setRadiusMeters}
          />

          <View style={styles.footer}>
            <OnboardingFooter
              onNext={handleComplete}
              onSkip={handleSkip}
              accentColor={colors.primary}
              nextLabel="Concluir"
              fullWidth
            />
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxxl,
    paddingTop: 60,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  footer: {
    marginTop: spacing.xl,
  },
});
