import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  useLeaderboardsColors,
  type LeaderboardsPalette,
} from '@/constants/leaderboardsTheme';

type PeriodFilter = 'Semana' | 'Mês' | 'Ano' | 'Geral';
type CategoryFilter = 'Geral' | 'Amigos' | 'Idade' | 'Género';
type TrendDirection = 'up' | 'down';

interface Runner {
  id: string;
  name: string;
  points: number;
  rank: number;
  trend: TrendDirection;
  trendDelta: number;
  image: string;
  gender: 'female' | 'male';
  ageGroup: '18-24' | '25-34' | '35-44';
  isFriend: boolean;
}

const PERIOD_FILTERS: PeriodFilter[] = ['Semana', 'Mês', 'Ano', 'Geral'];
const CATEGORY_FILTERS: CategoryFilter[] = ['Geral', 'Amigos', 'Idade', 'Género'];

const PERIOD_MULTIPLIERS: Record<PeriodFilter, number> = {
  Semana: 1,
  Mês: 4,
  Ano: 52,
  Geral: 260,
};

const CURRENT_USER: Runner = {
  id: 'alex-morgan',
  name: 'Alex Morgan',
  points: 78,
  rank: 8,
  trend: 'up',
  trendDelta: 1,
  image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  gender: 'male',
  ageGroup: '25-34',
  isFriend: false,
};

const RUNNERS: Runner[] = [
  {
    id: 'samantha',
    name: 'Samantha',
    points: 250,
    rank: 1,
    trend: 'up',
    trendDelta: 1,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    gender: 'female',
    ageGroup: '25-34',
    isFriend: true,
  },
  {
    id: 'james-grant',
    name: 'James Grant',
    points: 125,
    rank: 2,
    trend: 'down',
    trendDelta: 1,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    gender: 'male',
    ageGroup: '35-44',
    isFriend: false,
  },
  {
    id: 'josh-nathan',
    name: 'Josh Nathan',
    points: 100,
    rank: 3,
    trend: 'up',
    trendDelta: 2,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    gender: 'male',
    ageGroup: '18-24',
    isFriend: true,
  },
  {
    id: 'esther-howard',
    name: 'Esther Howard',
    points: 99,
    rank: 4,
    trend: 'up',
    trendDelta: 1,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    gender: 'female',
    ageGroup: '25-34',
    isFriend: false,
  },
  {
    id: 'kristin-watson',
    name: 'Kristin Watson',
    points: 85,
    rank: 5,
    trend: 'down',
    trendDelta: 2,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    gender: 'female',
    ageGroup: '35-44',
    isFriend: true,
  },
  {
    id: 'marina-costa',
    name: 'Marina Costa',
    points: 82,
    rank: 6,
    trend: 'up',
    trendDelta: 1,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    gender: 'female',
    ageGroup: '18-24',
    isFriend: false,
  },
  {
    id: 'rafael-lima',
    name: 'Rafael Lima',
    points: 80,
    rank: 7,
    trend: 'down',
    trendDelta: 1,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    gender: 'male',
    ageGroup: '25-34',
    isFriend: true,
  },
  CURRENT_USER,
  {
    id: 'beatriz-santos',
    name: 'Beatriz Santos',
    points: 74,
    rank: 9,
    trend: 'down',
    trendDelta: 1,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    gender: 'female',
    ageGroup: '25-34',
    isFriend: true,
  },
  {
    id: 'lucas-oliveira',
    name: 'Lucas Oliveira',
    points: 70,
    rank: 10,
    trend: 'up',
    trendDelta: 1,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    gender: 'male',
    ageGroup: '35-44',
    isFriend: false,
  },
];

export default function BestRunnersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useLeaderboardsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activePeriod, setActivePeriod] = useState<PeriodFilter>('Semana');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Geral');

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];

  const filteredRunners = useMemo(() => {
    const query = search.trim().toLowerCase();

    return RUNNERS.filter((runner) => {
      if (activeCategory === 'Amigos' && !runner.isFriend) return false;
      if (activeCategory === 'Idade' && runner.ageGroup !== CURRENT_USER.ageGroup) return false;
      if (activeCategory === 'Género' && runner.gender !== CURRENT_USER.gender) return false;
      if (query && !runner.name.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [activeCategory, search]);

  const formatPoints = (points: number) =>
    `${(points * periodMultiplier).toLocaleString('pt-BR')} pts`;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/leaderboards');
  };

  const handleResetFilters = () => {
    setSearch('');
    setActivePeriod('Semana');
    setActiveCategory('Geral');
  };

  const handleOptions = () => {
    Alert.alert(
      'Filtros do ranking',
      `Período: ${activePeriod}\nCategoria: ${activeCategory}`,
      [
        { text: 'Fechar', style: 'cancel' },
        { text: 'Limpar filtros', onPress: handleResetFilters },
      ]
    );
  };

  const renderTrend = (trend: TrendDirection, delta?: number) => (
    <View style={[styles.trendBadge, trend === 'up' ? styles.trendUp : styles.trendDown]}>
      <MaterialCommunityIcons
        name={trend === 'up' ? 'chevron-double-up' : 'chevron-double-down'}
        size={14}
        color={trend === 'up' ? colors.positive : colors.negative}
      />
      {delta != null && (
        <Text style={[styles.trendText, trend === 'up' ? styles.trendTextUp : styles.trendTextDown]}>
          {delta}
        </Text>
      )}
    </View>
  );

  const getRankStyle = (rank: number) => {
    if (rank === 1) return styles.rankFirst;
    if (rank === 2) return styles.rankSecond;
    if (rank === 3) return styles.rankThird;
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>

        <Text style={styles.headerTitle}>Best Runners</Text>

        <Pressable
          onPress={handleOptions}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Opções do ranking"
        >
          <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.searchContainer, isSearchFocused && styles.searchContainerFocused]}>
          <Ionicons name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Pesquisar atleta por nome..."
            placeholderTextColor={colors.textSecondary}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Pesquisar atleta por nome"
          />
          {!!search && (
            <Pressable
              onPress={() => setSearch('')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Limpar pesquisa"
            >
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        <View style={styles.timeFilters}>
          {PERIOD_FILTERS.map((period) => {
            const isActive = activePeriod === period;

            return (
              <Pressable
                key={period}
                onPress={() => setActivePeriod(period)}
                style={[styles.chipButton, isActive && styles.chipButtonActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Filtrar por ${period}`}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{period}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.categoryTabs}>
          {CATEGORY_FILTERS.map((category) => {
            const isActive = activeCategory === category;

            return (
              <Pressable
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Categoria ${category}`}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{category}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.list}>
          {filteredRunners.map((runner) => (
            <View key={runner.id} style={styles.runnerRow}>
              <View style={styles.runnerLeft}>
                <Text style={[styles.rank, getRankStyle(runner.rank)]}>{runner.rank}</Text>

                <Image source={{ uri: runner.image }} style={styles.avatar} />

                <View style={styles.runnerMeta}>
                  <Text style={styles.runnerName} numberOfLines={1}>
                    {runner.name}
                  </Text>
                  <Text style={styles.runnerScore}>{formatPoints(runner.points)}</Text>
                </View>
              </View>

              {renderTrend(runner.trend, runner.trendDelta)}
            </View>
          ))}

          {filteredRunners.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={30} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>Nenhum corredor encontrado</Text>
              <Text style={styles.emptyText}>
                Tente buscar por outro nome ou ajuste os filtros.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.stickyPanel,
          { paddingBottom: Math.max(insets.bottom, 14) },
        ]}
      >
        <View style={styles.stickyUser}>
          <View style={styles.userAvatarRing}>
            <Image source={{ uri: CURRENT_USER.image }} style={styles.userAvatar} />
          </View>

          <View>
            <Text style={styles.userBadge}>Sua posição</Text>
            <Text style={styles.stickyName}>{CURRENT_USER.name}</Text>
            <Text style={styles.stickyScore}>{formatPoints(CURRENT_USER.points)}</Text>
          </View>
        </View>

        <View style={styles.stickyRank}>
          <Text style={styles.stickyRankText}>{CURRENT_USER.rank}º</Text>
          {renderTrend(CURRENT_USER.trend)}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: LeaderboardsPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 14,
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      zIndex: 5,
    },
    headerTitle: {
      color: colors.textPrimary,
      fontSize: 17,
      fontWeight: '600',
      letterSpacing: -0.3,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconButtonPressed: {
      backgroundColor: colors.cardAlt,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    searchContainer: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      marginBottom: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    searchContainerFocused: {
      borderColor: colors.textSecondary,
    },
    searchInput: {
      flex: 1,
      height: '100%',
      padding: 0,
      color: colors.textPrimary,
      fontSize: 14,
    },
    timeFilters: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 20,
    },
    chipButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    chipButtonActive: {
      backgroundColor: colors.textPrimary,
      borderColor: colors.textPrimary,
    },
    chipText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    chipTextActive: {
      color: colors.background,
      fontWeight: '600',
    },
    categoryTabs: {
      flexDirection: 'row',
      padding: 3,
      marginBottom: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: 9,
    },
    tabItemActive: {
      backgroundColor: colors.cardAlt,
    },
    tabText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    tabTextActive: {
      color: colors.textPrimary,
      fontWeight: '600',
    },
    list: {
      gap: 8,
    },
    runnerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    runnerLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    rank: {
      width: 24,
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '700',
    },
    rankFirst: {
      color: colors.rankFirst,
    },
    rankSecond: {
      color: colors.rankSecond,
    },
    rankThird: {
      color: colors.rankThird,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.avatarBackground,
    },
    runnerMeta: {
      flex: 1,
      gap: 2,
    },
    runnerName: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    runnerScore: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    trendBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
    },
    trendUp: {
      backgroundColor: colors.positiveBackground,
    },
    trendDown: {
      backgroundColor: colors.negativeBackground,
    },
    trendText: {
      fontSize: 12,
      fontWeight: '600',
    },
    trendTextUp: {
      color: colors.positive,
    },
    trendTextDown: {
      color: colors.negative,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
      gap: 8,
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 13,
      textAlign: 'center',
      paddingHorizontal: 24,
    },
    stickyPanel: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 14,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: colors.stickyBackground,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 12,
    },
    stickyUser: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    userAvatarRing: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.avatarBackground,
    },
    userBadge: {
      color: colors.accent,
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 1,
    },
    stickyName: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    stickyScore: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 1,
    },
    stickyRank: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    stickyRankText: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
  });
