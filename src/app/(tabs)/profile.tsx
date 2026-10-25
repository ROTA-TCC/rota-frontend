import React, { useMemo, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProfileTopBar } from '@/components/profile/ProfileTopBar';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs, type ProfileTab } from '@/components/profile/ProfileTabs';
import { PostCard } from '@/components/profile/PostCard';
import { ProfileEmptyState } from '@/components/profile/ProfileEmptyState';
import { ActivityPostCard } from '@/components/social/ActivityPostCard';
import { ChallengeIcon, MedalIcon } from '@/components/profile/icons';
import { useProfileColors, type ProfilePalette } from '@/constants/profileTheme';
import { useTheme } from '@/providers/ThemeProvider';
import { mockProfile } from '@/constants/mockProfile';
import { profileActivityPost } from '@/constants/mockSocial';

const FEED_POST = {
  author: mockProfile.name,
  avatarUrl: mockProfile.avatarUrl,
  timeLabel: 'há 2h',
  text: 'Paisagem linda 🏔️✨',
  imageUrl:
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
  comments: 12,
  likes: 45,
};

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = useProfileColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState<ProfileTab>('feed');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ProfileTopBar
        experience={mockProfile.experience}
        onSettingsPress={() => router.push('/settings')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={mockProfile.name}
          avatarUrl={mockProfile.avatarUrl}
          followers={mockProfile.followers}
          following={mockProfile.following}
          verified
        />

        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'feed' && (
          <View style={styles.feed}>
            <ActivityPostCard post={profileActivityPost} />
            <PostCard {...FEED_POST} />
          </View>
        )}

        {activeTab === 'challenge' && (
          <ProfileEmptyState
            icon={ChallengeIcon}
            title="Nenhum desafio ativo"
            description="Participe de um desafio para acompanhar seu progresso por aqui."
          />
        )}

        {activeTab === 'medals' && (
          <ProfileEmptyState
            icon={MedalIcon}
            title="Nenhuma medalha ainda"
            description="Conclua desafios e atividades para conquistar suas primeiras medalhas."
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ProfilePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 18,
      paddingBottom: 28,
    },
    feed: {
      gap: 14,
    },
  });
