import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../themed-text';

const filters = ['Rotas', 'Extensão', 'Dificuldade', 'Elevação'];

interface MapFilterCarouselProps {
  onFilterPress?: (filter: string) => void;
}

export const MapFilterCarousel = ({ onFilterPress }: MapFilterCarouselProps) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
    {filters.map((filter, index) => (
      <TouchableOpacity 
        key={filter} 
        style={[styles.chip, index === 0 && styles.activeChip]}
        onPress={() => onFilterPress?.(filter)}
      >
        <ThemedText style={[styles.chipText, index === 0 && styles.activeChipText]}>{filter}</ThemedText>
        {index === 0 && <Ionicons name="chevron-down" size={10} color="#E34F1E" style={{ marginLeft: 4 }} />}
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  carousel: {
    paddingHorizontal: 16,
  },
  chip: {
    backgroundColor: 'rgba(15, 15, 15, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeChip: {
    borderColor: '#E34F1E',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  activeChipText: {
    color: '#E34F1E',
  },
});