import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FILTERS = [
  { id: '1', label: 'Ordenar', icon: null },
  { id: '2', label: 'Localização', icon: 'location-outline' as const },
  { id: '3', label: 'Atividade', icon: null },
  { id: '4', label: 'Horário', icon: null },
];

export function FilterChips() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((item) => (
        <TouchableOpacity key={item.id} style={styles.chip} activeOpacity={0.7}>
          {item.icon && <Ionicons name={item.icon} size={14} color="#8E8E93" />}
          <Text style={styles.label}>{item.label}</Text>
          <Ionicons name="chevron-down" size={12} color="#8E8E93" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'transparent',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
