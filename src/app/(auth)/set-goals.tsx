import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

const ORANGE = '#FF8C00';

export default function ProfileMetricsScreen() {
  const router = useRouter();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('masculino');

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
          <View style={styles.header}>
            <View style={styles.progressBar}>
              <View style={styles.step} />
              <View style={[styles.step, styles.activeStep]} />
              <View style={styles.step} />
            </View>

            <Text style={styles.subtitle}>Métricas corporais</Text>
            <Text style={styles.title}>Seus dados físicos</Text>
            <Text style={styles.description}>
              Estas informações são essenciais para calcular o seu gasto calórico, ritmo ideal e personalização das métricas de desempenho.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 70"
                placeholderTextColor="#55555A"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Altura (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 175"
                placeholderTextColor="#55555A"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gênero</Text>
              <View style={styles.genderOptions}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'masculino' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('masculino')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === 'masculino' && styles.genderTextActive,
                    ]}
                  >
                    Masculino
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'feminino' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('feminino')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === 'feminino' && styles.genderTextActive,
                    ]}
                  >
                    Feminino
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'outro' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('outro')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === 'outro' && styles.genderTextActive,
                    ]}
                  >
                    Outro
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnNext}
              onPress={() => router.push('/privacy-zone')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnNextText}>Próximo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSkip}
              onPress={() => router.push('/privacy-zone')}
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
    marginBottom: 24,
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
  formContainer: {
    gap: 20,
    marginVertical: 12,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#151515',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#222225',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#222225',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: ORANGE,
    backgroundColor: 'rgba(255, 140, 0, 0.12)',
  },
  genderText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
  },
  genderTextActive: {
    color: ORANGE,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    gap: 14,
    marginTop: 24,
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
