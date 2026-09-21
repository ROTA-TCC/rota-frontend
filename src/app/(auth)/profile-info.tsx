import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

export default function ProfileInfoScreen() {
  const accentColor = Colors.dark.tint; // #ff9a00

  return (
    <ThemedView style={styles.container}>
      {/* Glow effect blobs */}
      <View style={[styles.glowContainer, styles.topGlow]}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      </View>
      <View style={[styles.glowContainer, styles.bottomGlow]}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.step, styles.activeStep, { backgroundColor: accentColor }]} />
          <View style={styles.step} />
          <View style={styles.step} />
        </View>

        <ThemedText style={[styles.subtitle, { color: accentColor }]}>Informações pessoais</ThemedText>
        <ThemedText type="title" style={styles.title}>Informações do perfil</ThemedText>
        <ThemedText style={styles.description}>
          As informações do seu perfil desempenham um papel fundamental na personalização do acompanhamento de determinadas métricas.
        </ThemedText>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputPill}>
          <ThemedText style={styles.inputLabel}>Peso</ThemedText>
          <View style={[styles.inputValue, { backgroundColor: '#222222' }]}>
            <ThemedText style={{ color: accentColor }}>70,3 kg</ThemedText>
          </View>
        </View>

        <View style={styles.inputPill}>
          <ThemedText style={styles.inputLabel}>Altura</ThemedText>
          <View style={[styles.inputValue, { backgroundColor: '#222222' }]}>
            <ThemedText style={{ color: accentColor }}>175 cm</ThemedText>
          </View>
        </View>

        <View style={styles.inputPill}>
          <ThemedText style={styles.inputLabel}>Idade</ThemedText>
          <View style={[styles.inputValue, { backgroundColor: '#222222' }]}>
            <ThemedText style={{ color: accentColor }}>24 anos</ThemedText>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btnNext, { backgroundColor: accentColor }]}>
          <ThemedText style={styles.btnNextText}>Próximo</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSkip}>
          <ThemedText style={[styles.btnSkipText, { color: accentColor }]}>Pular</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(15, 20, 14, 0.5)', // Cor baseada no original com transparência
  },
  topGlow: {
    top: -80,
    right: -80,
  },
  bottomGlow: {
    bottom: -80,
    left: -80,
  },
  header: {
    marginBottom: 40,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
  },
  step: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#2A2A2A',
    width: 12,
  },
  activeStep: {
    width: 24,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  title: {
    marginBottom: 16,
  },
  description: {
    color: '#828282',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  formContainer: {
    gap: 16,
  },
  inputPill: {
    backgroundColor: '#151515',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputValue: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: 16,
  },
  btnNext: {
    height: 56,
    paddingHorizontal: 48,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNextText: {
    color: '#0A0F09',
    fontWeight: '700',
    fontSize: 15,
  },
  btnSkip: {
    padding: 10,
  },
  btnSkipText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
