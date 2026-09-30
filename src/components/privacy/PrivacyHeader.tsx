import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ORANGE = '#FF8C00';

export function PrivacyHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.progressBar}>
        <View style={styles.step} />
        <View style={styles.step} />
        <View style={[styles.step, styles.activeStep]} />
      </View>

      <Text style={styles.subtitle}>Privacidade</Text>
      <Text style={styles.title}>Ocultar região</Text>
      <Text style={styles.description}>
        Defina uma área no mapa para manter suas atividades privadas. Trajetos
        iniciados ou finalizados dentro desta zona não serão exibidos
        publicamente.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
