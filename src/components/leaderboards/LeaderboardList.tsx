import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLeaderboardsColors, type LeaderboardsPalette } from '@/constants/leaderboardsTheme';

export const LeaderboardList = ({
  title,
  items,
  onPress,
}: {
  title: string;
  items: any[];
  onPress?: () => void;
}) => {
  const colors = useLeaderboardsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        hitSlop={8}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={onPress ? `Ver ${title} completo` : undefined}
      >
        <Text style={styles.headerText}>{title}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </Pressable>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.itemLeft}>
            <View style={[styles.avatar, item.greenBg && styles.greenBg]}>
              <Image source={{ uri: item.image }} style={styles.avatarImg} />
            </View>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>{item.points} pontos</Text>
            </View>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.rank}>{item.rank}</Text>
            <MaterialCommunityIcons
              name={item.direction === 'up' ? 'chevron-double-up' : 'chevron-double-down'}
              size={18}
              color={item.direction === 'up' ? colors.positive : colors.negative}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const createStyles = (colors: LeaderboardsPalette) =>
  StyleSheet.create({
    card: { backgroundColor: colors.card, borderRadius: 20, padding: 20, gap: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerPressed: { opacity: 0.7 },
    headerText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.avatarBackground },
    greenBg: { backgroundColor: '#B4D77B' },
    avatarImg: { width: '100%', height: '100%', borderRadius: 22 },
    name: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
    sub: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
    itemRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    rank: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  });
