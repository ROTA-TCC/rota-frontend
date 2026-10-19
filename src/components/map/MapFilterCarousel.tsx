import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { spacing } from '@/theme';

const FILTERS = ['Rotas', 'Extensão', 'Dificuldade', 'Elevação'];

interface MapFilterCarouselProps {
  activeFilter?: string;
  onFilterPress?: (filter: string) => void;
}

export function MapFilterCarousel({
  activeFilter = FILTERS[0],
  onFilterPress,
}: MapFilterCarouselProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
      {FILTERS.map((filter) => (
        <Chip
          key={filter}
          label={filter}
          variant="solid"
          active={filter === activeFilter}
          showChevron
          onPress={() => onFilterPress?.(filter)}
          style={styles.chipSpacing}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  carousel: {
    paddingHorizontal: spacing.xl,
  },
  chipSpacing: {
    marginRight: spacing.md,
  },
});
