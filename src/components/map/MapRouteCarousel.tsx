import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export const MapRouteCarousel = () => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel} contentContainerStyle={styles.carouselContent}>
    {[1, 2].map((_, i) => (
      <View key={i} style={styles.routeCard}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=200' }} style={styles.routeImage} />
        <View style={styles.routeInfo}>
          <View style={styles.routeNameRow}>
            <Text style={styles.routeName}>Avenida Paulista...</Text>
            <Ionicons name="bookmark-outline" size={16} color="white" />
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.badgeComfort}><Text style={styles.badgeComfortText}>PLANO</Text></View>
            <Text style={styles.routeStats}>6,5 km • ⏱ 2h</Text>
          </View>
          <View style={styles.locationInfo}>
            <Ionicons name="locate" size={14} color="white" />
            <Text style={styles.locationText}>A 2,3 km de distância</Text>
          </View>
          <View style={styles.specialTag}>
            <Ionicons name="flame" size={14} color="#AFC170" />
            <Text style={styles.specialTagText}>Em alta hoje</Text>
          </View>
        </View>
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  carousel: { position: 'absolute', bottom: 24, left: 0, right: 0 },
  carouselContent: { paddingHorizontal: 16, gap: 12 },
  routeCard: { width: 320, backgroundColor: 'rgba(15, 15, 15, 0.95)', borderRadius: 16, flexDirection: 'row', overflow: 'hidden' },
  routeImage: { width: 105 },
  routeInfo: { padding: 14, flex: 1, gap: 6 },
  routeNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routeName: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeComfort: { backgroundColor: 'rgba(175, 193, 112, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#AFC170' },
  badgeComfortText: { color: '#AFC170', fontSize: 10.5, fontWeight: '800' },
  routeStats: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  locationInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  specialTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  specialTagText: { color: '#AFC170', fontSize: 13, fontWeight: '700' },
});