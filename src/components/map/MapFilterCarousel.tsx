import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMapColors, type MapPalette } from '@/constants/mapTheme';

const filters = ['Rotas', 'Extensão', 'Dificuldade', 'Elevação'];

interface MapFilterCarouselProps {
  onFilterPress?: (filter: string) => void;
}

export const MapFilterCarousel = ({ onFilterPress }: MapFilterCarouselProps) => {
  const colors = useMapColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
      {filters.map((filter, index) => (
        <TouchableOpacity
          key={filter}
          style={[styles.chip, index === 0 && styles.activeChip]}
          onPress={() => onFilterPress?.(filter)}
        >
          <Text style={[styles.chipText, index === 0 && styles.activeChipText]}>{filter}</Text>
          {index === 0 && (
            <Ionicons name="chevron-down" size={10} color={colors.accent} style={{ marginLeft: 4 }} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const createStyles = (colors: MapPalette) =>
  StyleSheet.create({
    carousel: {
      paddingHorizontal: 16,
    },
    chip: {
      backgroundColor: colors.surface,
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
      borderColor: colors.accent,
    },
    chipText: {
      color: colors.textPrimary,
      fontSize: 13.5,
      fontWeight: '700',
    },
    activeChipText: {
      color: colors.accent,
    },
  });
