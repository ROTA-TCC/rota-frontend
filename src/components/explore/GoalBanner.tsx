import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useExploreColors, type ExplorePalette } from '@/constants/exploreTheme';

interface GoalBannerProps {
  goal: string;
}

export function GoalBanner({ goal }: GoalBannerProps) {
  const colors = useExploreColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Boa! Mantenha o ritmo para alcançar os primeiros{' '}
        <Text style={styles.highlight}>{goal} ⚡</Text>
      </Text>
    </View>
  );
}

const createStyles = (colors: ExplorePalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.borderCard,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    text: {
      color: colors.textBanner,
      fontSize: 13,
      lineHeight: 17.55,
    },
    highlight: {
      color: colors.accentOrange,
      fontWeight: '600',
    },
  });
