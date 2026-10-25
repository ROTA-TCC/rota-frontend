import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMapColors, type MapPalette } from '@/constants/mapTheme';

export const MapRouteCarousel = () => {
  const colors = useMapColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel} contentContainerStyle={styles.carouselContent}>
      {[1, 2].map((_, i) => (
        <View key={i} style={styles.routeCard}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=200' }} style={styles.routeImage} />
          <View style={styles.routeInfo}>
            <View style={styles.routeNameRow}>
              <Text style={styles.routeName}>Avenida Paulista...</Text>
              <Ionicons name="bookmark-outline" size={16} color={colors.textPrimary} />
            </View>
            <View style={styles.badgeRow}>
              <View style={styles.badgeComfort}><Text style={styles.badgeComfortText}>PLANO</Text></View>
              <Text style={styles.routeStats}>6,5 km • ⏱ 2h</Text>
            </View>
            <View style={styles.locationInfo}>
              <Ionicons name="locate" size={14} color={colors.textPrimary} />
              <Text style={styles.locationText}>A 2,3 km de distância</Text>
            </View>
            <View style={styles.specialTag}>
              <Ionicons name="flame" size={14} color="#FF8C00" />
              <Text style={styles.specialTagText}>Em alta hoje</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const createStyles = (colors: MapPalette) =>
  StyleSheet.create({
    carousel: { marginTop: 16, marginBottom: 16 },
    carouselContent: { paddingHorizontal: 16, gap: 12 },
    routeCard: { width: 320, backgroundColor: colors.surface, borderRadius: 16, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
    routeImage: { width: 105 },
    routeInfo: { padding: 14, flex: 1, gap: 6 },
    routeNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    routeName: { color: colors.textPrimary, fontSize: 15, fontWeight: '800' },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    badgeComfort: { backgroundColor: 'rgba(255, 140, 0, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#FF8C00' },
    badgeComfortText: { color: '#FF8C00', fontSize: 10.5, fontWeight: '800' },
    routeStats: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
    locationInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    locationText: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
    specialTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    specialTagText: { color: '#FF8C00', fontSize: 13, fontWeight: '700' },
  });
