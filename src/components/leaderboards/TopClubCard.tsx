import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useLeaderboardsColors, type LeaderboardsPalette } from '@/constants/leaderboardsTheme';

interface TopClub {
  name: string;
  members: number;
}

export const TopClubsList = ({
  title,
  clubs,
  onPress,
}: {
  title: string;
  clubs: TopClub[];
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
      <View style={styles.list}>
        {clubs.map((club, index) => (
          <View key={index} style={[styles.item, index !== clubs.length - 1 && styles.itemSeparator]}>
            <View style={styles.itemLeft}>
              <View style={styles.clubIcon}>
                <FontAwesome5 name="sun" size={20} color="#FF7B31" />
              </View>
              <View>
                <Text style={styles.name}>{club.name}</Text>
                <View style={styles.clubSub}>
                  <FontAwesome5 name="user" size={10} color={colors.textSecondary} />
                  <Text style={styles.sub}>{club.members.toLocaleString()} membros</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: LeaderboardsPalette) =>
  StyleSheet.create({
    card: { backgroundColor: colors.card, borderRadius: 20, padding: 20, gap: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerPressed: { opacity: 0.7 },
    headerText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
    list: { gap: 16 },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemSeparator: { borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 16 },
    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    clubIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardAlt, justifyContent: 'center', alignItems: 'center' },
    name: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
    sub: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
    clubSub: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  });
