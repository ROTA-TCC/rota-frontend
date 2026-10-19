import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { colors, radius, spacing, typography } from '@/theme';

type Track = {
  id: string;
  title: string;
  views: string;
  rating: string;
  reviews: string;
  image: string;
};

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Aterro do Flamengo, RJ',
    views: '12.5M',
    rating: '4.9',
    reviews: '12M',
    image:
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'Parque Ibirapuera, SP',
    views: '15.1M',
    rating: '4.9',
    reviews: '15M',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'Lagoa da Pampulha, MG',
    views: '8.2M',
    rating: '4.7',
    reviews: '8M',
    image:
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80',
  },
];

function TrackCard({ track }: { track: Track }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: track.image }} style={styles.image} />
      </View>

      <View style={styles.info}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {track.title}
        </ThemedText>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={13} color={colors.textSecondary} />
            <ThemedText style={styles.statText}>{track.views}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={13} color={colors.gold} />
            <ThemedText style={styles.statText}>
              {track.rating} ({track.reviews})
            </ThemedText>
          </View>
        </View>
      </View>

      <Button label="Explorar rota" variant="secondary" size="small" style={styles.cardButton} />
    </View>
  );
}

export function TrackCarousel() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {TRACKS.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: -20,
  },
  container: {
    paddingHorizontal: spacing.xxl,
    gap: 14,
    paddingVertical: spacing.xs,
  },
  card: {
    width: 250,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.lg,
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: '100%',
    height: 120,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  cardButton: {
    marginTop: spacing.xs,
  },
});
