import React, { useMemo, type ComponentType } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProfileColors, type ProfilePalette } from '@/constants/profileTheme';
import {
  ChallengeIcon,
  FeedIcon,
  MedalIcon,
  type IconProps,
} from './icons';

export type ProfileTab = 'feed' | 'challenge' | 'medals';

interface TabConfig {
  id: ProfileTab;
  label: string;
  Icon: ComponentType<IconProps>;
}

const TABS: TabConfig[] = [
  { id: 'feed', label: 'Feed', Icon: FeedIcon },
  { id: 'challenge', label: 'Desafio', Icon: ChallengeIcon },
  { id: 'medals', label: 'Medalhas', Icon: MedalIcon },
];

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ activeTab, onChange }: ProfileTabsProps) {
  const colors = useProfileColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {TABS.map(({ id, label, Icon }) => {
        const isActive = id === activeTab;
        const color = isActive ? colors.accentText : colors.textPrimary;

        return (
          <TouchableOpacity
            key={id}
            style={[styles.tab, isActive ? styles.activeTab : styles.inactiveTab]}
            activeOpacity={0.8}
            onPress={() => onChange(id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Icon size={15} color={color} />
            <Text style={[styles.label, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ProfilePalette) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      height: 42,
      paddingHorizontal: 8,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    activeTab: {
      backgroundColor: colors.accent,
    },
    inactiveTab: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
    },
  });
