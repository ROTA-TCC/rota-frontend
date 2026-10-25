import React, { useMemo } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { NearbyPeople } from '@/components/explore/NearbyPeople';
import { GoalBanner } from '@/components/explore/GoalBanner';
import { DailyAverageCard } from '@/components/explore/DailyAverageCard';
import { MetricCard } from '@/components/explore/MetricCard';
import { HeartIcon } from '@/components/explore/icons';
import { ActivityPostCard } from '@/components/social/ActivityPostCard';
import { useExploreColors, type ExplorePalette } from '@/constants/exploreTheme';
import { useTheme } from '@/providers/ThemeProvider';
import {
  dailySteps,
  exploreMetrics,
  nearbyPeople,
  stepsByHour,
  stepsHighlightIndex,
} from '@/constants/mockExplore';
import { communityActivityPost } from '@/constants/mockSocial';
import { mockProfile } from '@/constants/mockProfile';

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = useExploreColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ExploreHeader
          avatarUrl={mockProfile.avatarUrl}
          onAvatarPress={() => router.navigate('/(tabs)/profile')}
        />

        <NearbyPeople people={nearbyPeople} />

        <GoalBanner goal="5 km" />

        <DailyAverageCard
          title="Atividade diária"
          value={dailySteps}
          unit="Passos"
          data={stepsByHour}
          highlightIndex={stepsHighlightIndex}
        />

        <View style={styles.metricsGrid}>
          <MetricCard
            title="Batimentos"
            icon={HeartIcon}
            value={exploreMetrics.heartRate}
            unit="BPM"
            average={exploreMetrics.heartRateAverage}
          />
          <MetricCard
            title="Calorias"
            icon={HeartIcon}
            value={exploreMetrics.calories}
            unit="CAL"
            average={exploreMetrics.caloriesAverage}
            variant="accent"
          />
        </View>

        <View style={styles.feedSection}>
          <Text style={styles.feedTitle}>Feed da comunidade</Text>
          <ActivityPostCard post={communityActivityPost} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ExplorePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 14,
      paddingTop: 16,
      paddingBottom: 28,
      gap: 14,
    },
    metricsGrid: {
      flexDirection: 'row',
      gap: 12,
    },
    feedSection: {
      gap: 10,
      marginTop: 4,
    },
    feedTitle: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
      paddingLeft: 2,
    },
  });
