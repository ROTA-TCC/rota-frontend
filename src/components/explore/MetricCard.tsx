import React, { useMemo, type ComponentType } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useExploreColors, type ExplorePalette } from '@/constants/exploreTheme';
import { ChevronRightIcon, type IconProps } from './icons';

type MetricCardVariant = 'dark' | 'accent';

interface MetricCardProps {
  title: string;
  icon: ComponentType<IconProps>;
  value: number;
  unit: string;
  average: string;
  variant?: MetricCardVariant;
  onPress?: () => void;
}

export function MetricCard({
  title,
  icon: Icon,
  value,
  unit,
  average,
  variant = 'dark',
  onPress,
}: MetricCardProps) {
  const colors = useExploreColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isAccent = variant === 'accent';
  const titleColor = isAccent ? colors.caloriesText : colors.textPrimary;

  return (
    <TouchableOpacity
      style={[styles.container, isAccent ? styles.accentCard : styles.darkCard]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${title}: ${value} ${unit}. Média: ${average}`}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        <ChevronRightIcon
          size={14}
          color={isAccent ? colors.caloriesText : colors.textChevron}
        />
      </View>

      <View style={styles.metricRow}>
        <View style={[styles.iconWrapper, isAccent ? styles.accentIcon : styles.darkIcon]}>
          <Icon
            size={13}
            color={isAccent ? colors.accentOrange : colors.caloriesText}
          />
        </View>

        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: titleColor }]}>{value}</Text>
          <Text style={[styles.unit, isAccent ? styles.unitAccent : styles.unitDark]}>{unit}</Text>
        </View>
      </View>

      <View style={[styles.averagePill, isAccent ? styles.averagePillAccent : styles.averagePillDark]}>
        <Text
          style={[
            styles.averageLabel,
            { color: isAccent ? colors.caloriesPillLabel : colors.textMuted },
          ]}
        >
          MÉDIA
        </Text>
        <Text
          style={[
            styles.averageValue,
            { color: isAccent ? colors.caloriesText : colors.textPrimary },
          ]}
        >
          {average}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ExplorePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: 140,
      borderRadius: 22,
      padding: 14,
      justifyContent: 'space-between',
    },
    darkCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.borderCard,
    },
    accentCard: {
      backgroundColor: colors.accentOrange,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
    },
    metricRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    iconWrapper: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    darkIcon: {
      backgroundColor: colors.accentOrange,
    },
    accentIcon: {
      backgroundColor: colors.background,
    },
    valueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 4,
    },
    value: {
      fontSize: 26,
      fontWeight: '700',
      lineHeight: 26,
    },
    unit: {
      fontSize: 10,
    },
    unitDark: {
      color: colors.textMuted,
      fontWeight: '500',
    },
    unitAccent: {
      color: colors.caloriesUnit,
      fontWeight: '700',
    },
    averagePill: {
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    averagePillDark: {
      backgroundColor: colors.storyAvatar,
      borderWidth: 1,
      borderColor: colors.borderPill,
    },
    averagePillAccent: {
      backgroundColor: colors.caloriesPillBackground,
    },
    averageLabel: {
      fontSize: 10,
    },
    averageValue: {
      fontSize: 10,
      fontWeight: '700',
    },
  });
