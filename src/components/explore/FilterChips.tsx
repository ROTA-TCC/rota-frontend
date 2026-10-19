import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { spacing } from '@/theme';

const FILTERS: { id: string; label: string; icon?: 'location-outline' }[] = [
  { id: '1', label: 'Ordenar' },
  { id: '2', label: 'Localização', icon: 'location-outline' },
  { id: '3', label: 'Atividade' },
  { id: '4', label: 'Horário' },
];

export function FilterChips() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((item) => (
        <Chip key={item.id} label={item.label} icon={item.icon} showChevron />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: spacing.xs,
  },
});
