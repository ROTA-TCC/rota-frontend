import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { colors, radius, spacing, typography } from '@/theme';

const ROUTE_IMAGE_URI =
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=200';

const ROUTE_IDS = ['route-1', 'route-2'];

type RouteCardProps = {
  name: string;
  stats: string;
  distanceLabel: string;
};

function RouteCard({ name, stats, distanceLabel }: RouteCardProps) {
  return (
    <View style={styles.routeCard}>
      <Image source={{ uri: ROUTE_IMAGE_URI }} style={styles.routeImage} />
      <View style={styles.routeInfo}>
        <View style={styles.routeNameRow}>
          <ThemedText style={styles.routeName}>{name}</ThemedText>
          <Ionicons name="bookmark-outline" size={16} color={colors.text} />
        </View>
        <View style={styles.badgeRow}>
          <View style={styles.badgeComfort}>
            <ThemedText style={styles.badgeComfortText}>PLANO</ThemedText>
          </View>
          <ThemedText style={styles.routeStats}>{stats}</ThemedText>
        </View>
        <View style={styles.locationInfo}>
          <Ionicons name="locate" size={14} color={colors.text} />
          <ThemedText style={styles.locationText}>{distanceLabel}</ThemedText>
        </View>
        <View style={styles.specialTag}>
          <Ionicons name="flame" size={14} color={colors.primary} />
          <ThemedText style={styles.specialTagText}>Em alta hoje</ThemedText>
        </View>
      </View>
    </View>
  );
}

export function MapRouteCarousel() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.carousel}
      contentContainerStyle={styles.carouselContent}
    >
      {ROUTE_IDS.map((id) => (
        <RouteCard
          key={id}
          name="Avenida Paulista..."
          stats="6,5 km • ⏱ 2h"
          distanceLabel="A 2,3 km de distância"
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  carousel: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  carouselContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  routeCard: {
    width: 320,
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  routeImage: {
    width: 105,
  },
  routeInfo: {
    padding: 14,
    flex: 1,
    gap: spacing.sm,
  },
  routeNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeName: {
    color: colors.text,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.heavy,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badgeComfort: {
    backgroundColor: colors.badgeHighlight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  badgeComfortText: {
    color: colors.primary,
    fontSize: 10.5,
    fontWeight: typography.weights.heavy,
  },
  routeStats: {
    color: colors.text,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationText: {
    color: colors.text,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
  },
  specialTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  specialTagText: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
});
