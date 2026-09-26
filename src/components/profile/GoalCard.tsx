import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function GoalCard() {
  const progress = 75;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="flag" size={16} color="#D4ED6D" />
          <Text style={styles.title}>Meta Mensal de Corrida</Text>
        </View>
        <Text style={styles.percentage}>{progress}%</Text>
      </View>

      <Text style={styles.subtitle}>75 km de 100 km concluídos</Text>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: '#151515',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  percentage: {
    color: '#D4ED6D',
    fontSize: 15,
    fontWeight: '800',
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D4ED6D',
    borderRadius: 4,
  },
});
