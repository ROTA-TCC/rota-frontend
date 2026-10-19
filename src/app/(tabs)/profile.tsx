import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileListCard, type ProfileListItem } from '@/components/profile/ProfileListCard';
import { colors, spacing } from '@/theme';

const ACCOUNT_SETTINGS: ProfileListItem[] = [
  { icon: 'person-outline', title: 'Informações Pessoais' },
  { icon: 'notifications-outline', title: 'Notificações' },
  { icon: 'lock-closed-outline', title: 'Privacidade' },
  { icon: 'shield-outline', title: 'Segurança' },
];

const SUPPORT_SETTINGS: ProfileListItem[] = [
  { icon: 'help-circle-outline', title: 'Ajuda e Suporte' },
  { icon: 'document-text-outline', title: 'Termos de Uso' },
  { icon: 'information-circle-outline', title: 'Sobre' },
  { icon: 'log-out-outline', title: 'Sair' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />

        <View style={styles.settingsSection}>
          <ProfileListCard title="Preferências da Conta" items={ACCOUNT_SETTINGS} />
        </View>
        <ProfileListCard title="Suporte e Legal" items={SUPPORT_SETTINGS} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    gap: spacing.xxxl,
  },
  settingsSection: {
    marginTop: 30,
  },
});
