import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useExploreColors, type ExplorePalette } from '@/constants/exploreTheme';
import type { NearbyPerson } from '@/types/explore';
import { PersonIcon } from './icons';

interface NearbyPeopleProps {
  people: NearbyPerson[];
  onPersonPress?: (person: NearbyPerson) => void;
}

function NearbyPersonItem({
  person,
  onPress,
}: {
  person: NearbyPerson;
  onPress?: () => void;
}) {
  const colors = useExploreColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={styles.person}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={person.name}
    >
      <View style={styles.avatarRing}>
        {person.avatarUrl ? (
          <Image source={{ uri: person.avatarUrl }} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={styles.avatarFallback}>
            <PersonIcon size={28} color={colors.textStoryIcon} />
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {person.name}
      </Text>
    </TouchableOpacity>
  );
}

export function NearbyPeople({ people, onPersonPress }: NearbyPeopleProps) {
  const colors = useExploreColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pessoas por perto</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stories}
      >
        {people.map((person) => (
          <NearbyPersonItem
            key={person.id}
            person={person}
            onPress={onPersonPress ? () => onPersonPress(person) : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ExplorePalette) =>
  StyleSheet.create({
    container: {
      gap: 10,
      marginTop: 2,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
      paddingLeft: 2,
    },
    stories: {
      gap: 12,
    },
    person: {
      width: 58,
      alignItems: 'center',
      gap: 6,
    },
    avatarRing: {
      width: 58,
      height: 58,
      borderRadius: 29,
      borderWidth: 1.5,
      borderColor: colors.accentOrange,
      overflow: 'hidden',
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    avatarFallback: {
      flex: 1,
      backgroundColor: colors.storyAvatar,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      color: colors.textMuted,
      fontSize: 11,
    },
  });
