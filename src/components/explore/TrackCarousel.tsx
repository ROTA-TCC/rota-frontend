import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TRACKS = [
  {
    id: '1',
    title: 'Lane Cove Riverside Walk',
    views: '10.2M',
    rating: '4.5',
    reviews: '10M',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'Ennogera Reservoir Trail',
    views: '8.1M',
    rating: '4.8',
    reviews: '8M',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
  },
];

export function TrackCarousel() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TRACKS.map((item) => (
        <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.85}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>

          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Ionicons name="eye-outline" size={13} color="#8E8E93" />
                <Text style={styles.statText}>{item.views} Views</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="star" size={13} color="#FFD700" />
                <Text style={styles.statText}>
                  {item.rating} ({item.reviews})
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 4,
  },
  card: {
    width: 250,
    backgroundColor: '#151515',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    gap: 10,
  },
  imageWrapper: {
    width: '100%',
    height: 125,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    gap: 4,
    paddingHorizontal: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stats: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '600',
  },
});
