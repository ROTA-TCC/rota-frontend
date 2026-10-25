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
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  MOCK_CLUBS,
  type Club,
  type ClubFilter,
} from '@/constants/mockClubs';
import {
  useLeaderboardsColors,
  type LeaderboardsPalette,
} from '@/constants/leaderboardsTheme';

interface FilterOption {
  id: ClubFilter;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

const FILTERS: FilterOption[] = [
  { id: 'Todos', label: 'Todos', icon: 'tune-variant' },
  { id: 'Asfalto', label: 'Asfalto', icon: 'road-variant' },
  { id: 'Trail / Montanha', label: 'Trail / Montanha', icon: 'terrain' },
  { id: 'São Paulo', label: 'São Paulo', icon: 'map-marker-outline' },
  { id: '+500 Membros', label: '+500 Membros', icon: 'account-group-outline' },
];

export default function ClubsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useLeaderboardsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ClubFilter>('Todos');
  const [showAllClubs, setShowAllClubs] = useState(false);

  const query = search.trim().toLowerCase();

  const filteredClubs = useMemo(() => {
    return MOCK_CLUBS.filter((club) => {
      if (activeFilter === 'Asfalto' && club.terrain !== 'Asfalto') return false;
      if (activeFilter === 'Trail / Montanha' && club.terrain !== 'Trail') return false;
      if (activeFilter === 'São Paulo' && club.city !== 'São Paulo') return false;
      if (activeFilter === '+500 Membros' && club.members <= 500) return false;

      if (!query) return true;

      const searchable = [club.name, club.locationLabel, club.city, ...club.tags]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [activeFilter, query]);

  const hasActiveSearch = activeFilter !== 'Todos' || query.length > 0;
  const isFiltering = showAllClubs || hasActiveSearch;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/leaderboards');
  };

  const handleCreateClub = () => {
    Alert.alert(
      'Criar clube',
      'A criação de clubes estará disponível em breve no Rota.',
      [{ text: 'Entendi' }]
    );
  };

  const handleShowAll = () => {
    setShowAllClubs(true);
    setActiveFilter('Todos');
    setSearch('');
  };

  const handleViewClub = (club: Club) => {
    Alert.alert(
      club.name,
      `${club.description}\n\n${club.tags.join(' • ')}\n${club.locationLabel} · ${club.members.toLocaleString(
        'pt-BR'
      )} membros`,
      [{ text: 'Fechar', style: 'cancel' }]
    );
  };

  const renderClubCard = (club: Club) => (
    <Pressable
      key={club.id}
      onPress={() => handleViewClub(club)}
      style={({ pressed }) => [styles.clubCard, pressed && styles.clubCardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Ver clube ${club.name}`}
    >
      <Image source={{ uri: club.image }} style={styles.clubImage} />

      <View style={styles.clubDetails}>
        <View style={styles.clubTitleRow}>
          <Text style={styles.clubName} numberOfLines={1}>
            {club.name}
          </Text>
          {club.verified && (
            <Ionicons
              name="checkmark-circle"
              size={14}
              color={colors.accent}
              accessibilityLabel="Clube verificado"
            />
          )}
        </View>

        <View style={styles.clubTags}>
          {club.tags.map((tag) => (
            <View key={tag} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.clubMeta}>
          <Ionicons name="location-outline" size={11} color={colors.textSecondary} />
          <Text style={styles.metaText} numberOfLines={1}>
            {club.locationLabel}
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Ionicons name="people-outline" size={11} color={colors.textSecondary} />
          <Text style={styles.metaText}>{club.members.toLocaleString('pt-BR')}</Text>
        </View>
      </View>

      <View style={styles.clubAction}>
        <Text style={styles.clubActionText}>Ver</Text>
      </View>
    </Pressable>
  );

  const renderSection = (title: string, clubs: Club[], onSeeAll?: () => void) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAll && (
          <Pressable
            onPress={onSeeAll}
            hitSlop={8}
            style={styles.seeAll}
            accessibilityRole="button"
            accessibilityLabel="Ver todos os clubes"
          >
            <Text style={styles.seeAllText}>Ver todos</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.accent} />
          </Pressable>
        )}
      </View>

      <View style={styles.clubsList}>{clubs.map(renderClubCard)}</View>

      {clubs.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={30} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Nenhum clube encontrado</Text>
          <Text style={styles.emptyText}>
            Tente buscar por outro nome ou ajuste os filtros.
          </Text>
        </View>
      )}
    </View>
  );

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

        <Text style={styles.headerTitle}>Explorar Clubes</Text>

        <Pressable
          onPress={handleCreateClub}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Criar clube"
        >
          <Ionicons name="add" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 40 + insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.searchBox, isSearchFocused && styles.searchBoxFocused]}>
          <Ionicons name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Buscar por nome, cidade ou estilo..."
            placeholderTextColor={colors.textSecondary}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Buscar clubes"
          />
          {!!search && (
            <Pressable
              onPress={() => setSearch('')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
            >
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filters}
          keyboardShouldPersistTaps="handled"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <Pressable
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Filtrar por ${filter.label}`}
              >
                <MaterialCommunityIcons
                  name={filter.icon}
                  size={13}
                  color={isActive ? colors.accentText : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <LinearGradient
          colors={[colors.cardAlt, colors.card] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.createBanner}
        >
          <View style={styles.createBannerInfo}>
            <Text style={styles.createBannerTitle}>Crie o seu próprio clube</Text>
            <Text style={styles.createBannerSub}>
              Organize treinos, crie desafios e convide a sua comunidade.
            </Text>
          </View>

          <Pressable
            onPress={handleCreateClub}
            style={({ pressed }) => [
              styles.createButton,
              pressed && styles.createButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Criar novo clube"
          >
            <Ionicons name="add" size={14} color={colors.accentText} />
            <Text style={styles.createButtonText}>Criar</Text>
          </Pressable>
        </LinearGradient>

        {isFiltering
          ? renderSection(hasActiveSearch ? 'Resultados' : 'Todos os clubes', filteredClubs)
          : (
            <>
              {renderSection(
                'Destaques da Semana',
                MOCK_CLUBS.filter((club) => club.featured),
                handleShowAll
              )}
              {renderSection(
                'Populares em São Paulo',
                MOCK_CLUBS.filter((club) => club.popular)
              )}
              {renderSection(
                'Recomendados para o seu pace',
                MOCK_CLUBS.filter((club) => club.recommended)
              )}
            </>
          )}
      </ScrollView>
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
      paddingTop: 16,
    },
    searchBox: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      marginBottom: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    searchBoxFocused: {
      borderColor: colors.accent,
    },
    searchInput: {
      flex: 1,
      height: '100%',
      padding: 0,
      color: colors.textPrimary,
      fontSize: 13,
    },
    filtersScroll: {
      marginBottom: 20,
      marginHorizontal: -16,
    },
    filters: {
      gap: 8,
      paddingHorizontal: 16,
      paddingBottom: 4,
    },
    filterPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    filterPillActive: {
      borderColor: colors.accent,
      backgroundColor: colors.accent,
    },
    filterPillText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    filterPillTextActive: {
      color: colors.accentText,
      fontWeight: '600',
    },
    createBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: 16,
      marginBottom: 24,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.accentBorder,
      overflow: 'hidden',
    },
    createBannerInfo: {
      flex: 1,
      gap: 4,
    },
    createBannerTitle: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    createBannerSub: {
      color: colors.textSecondary,
      fontSize: 11,
      lineHeight: 15,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: colors.accent,
    },
    createButtonPressed: {
      opacity: 0.8,
    },
    createButtonText: {
      color: colors.accentText,
      fontSize: 12,
      fontWeight: '700',
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
      letterSpacing: -0.2,
    },
    seeAll: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    seeAllText: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '500',
    },
    clubsList: {
      gap: 12,
    },
    clubCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    clubCardPressed: {
      borderColor: colors.accent,
      opacity: 0.92,
    },
    clubImage: {
      width: 56,
      height: 56,
      borderRadius: 14,
      backgroundColor: colors.avatarBackground,
    },
    clubDetails: {
      flex: 1,
      gap: 4,
    },
    clubTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    clubName: {
      flexShrink: 1,
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    clubTags: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6,
    },
    tagBadge: {
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 6,
      backgroundColor: colors.cardAlt,
    },
    tagText: {
      color: colors.textPrimary,
      fontSize: 10,
      fontWeight: '500',
    },
    clubMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 4,
      marginTop: 2,
    },
    metaText: {
      flexShrink: 1,
      color: colors.textSecondary,
      fontSize: 11,
    },
    metaDot: {
      color: colors.textSecondary,
      fontSize: 11,
    },
    clubAction: {
      alignSelf: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.cardAlt,
    },
    clubActionText: {
      color: colors.textPrimary,
      fontSize: 11,
      fontWeight: '600',
    },
    emptyState: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 32,
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
  });
