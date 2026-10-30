import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GoalProgressWidget } from '@/components/Record/GoalProgressWidget';
import { SportCard } from '@/components/Record/SportCard';
import { sportIcons } from '@/components/Record/icons';
import { useRecordColors, type RecordPalette } from '@/constants/recordTheme';
import { useTheme } from '@/providers/ThemeProvider';
import { featuredSports, weeklyGoal } from '@/constants/mockRecord';

export default function RecordScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = useRecordColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleStart = (trackingType: string) => {
    router.push(`/run/active-run?type=${trackingType}`);
  };

  const handleMoreSports = () => {
    Alert.alert('Mais esportes', 'Novos esportes estarão disponíveis em breve.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gravar</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GoalProgressWidget progress={weeklyGoal.progress} remaining={weeklyGoal.remaining} />

        <Text style={styles.sectionLabel}>Atividades</Text>

        {featuredSports.map((sport) => (
          <SportCard
            key={sport.id}
            title={sport.title}
            subtitle={sport.subtitle}
            icon={sportIcons[sport.id]}
            onStart={() => handleStart(sport.trackingType)}
          />
        ))}

        <Pressable
          style={({ pressed }) => [styles.moreButton, pressed && styles.moreButtonPressed]}
          onPress={handleMoreSports}
          accessibilityRole="button"
          accessibilityLabel="Ver mais esportes"
        >
          <Text style={styles.moreButtonText}>Mais esportes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: RecordPalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
    },
    headerTitle: {
      color: colors.textPrimary,
      fontSize: 30,
      fontWeight: '800',
      letterSpacing: -0.6,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 32,
      gap: 16,
    },
    sectionLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginTop: 4,
    },
    moreButton: {
      height: 48,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    moreButtonPressed: {
      backgroundColor: colors.accentSoft,
    },
    moreButtonText: {
      color: colors.accent,
      fontSize: 14,
      fontWeight: '700',
    },
  });
