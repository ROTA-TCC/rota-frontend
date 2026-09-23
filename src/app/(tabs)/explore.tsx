import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderSearch } from '@/components/explore/HeaderSearch';
import { FilterChips } from '@/components/explore/FilterChips';
import { RecommendationGrid } from '@/components/explore/RecommendationGrid';
import { TrackCarousel } from '@/components/explore/TrackCarousel';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderSearch />
          <FilterChips />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recomendações</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="chevron-forward" size={18} color="#555555" />
              </TouchableOpacity>
            </View>
            <RecommendationGrid />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Melhores rotas próximas</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="chevron-forward" size={18} color="#555555" />
              </TouchableOpacity>
            </View>
            <TrackCarousel />

            <TouchableOpacity style={styles.exploreAllBtn} activeOpacity={0.8}>
              <Text style={styles.exploreAllText}>Ver todas as rotas</Text>
              <Ionicons name="arrow-forward" size={16} color="#111111" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050505',
  },
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 28,
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  exploreAllBtn: {
    backgroundColor: '#D4ED6D',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  exploreAllText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
});
