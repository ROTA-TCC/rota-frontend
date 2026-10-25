import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { mockProfile } from '@/constants/mockProfile';
import { useSettingsColors, type SettingsPalette } from '@/constants/settingsTheme';
import { SettingsTopBar } from '@/components/settings/SettingsTopBar';
import { SettingsGroup } from '@/components/settings/SettingsGroup';
import { SettingsProfileCard } from '@/components/settings/SettingsProfileCard';
import { SettingsItem } from '@/components/settings/SettingsItem';
import { SettingsToggle } from '@/components/settings/SettingsToggle';
import { LogoutButton } from '@/components/settings/LogoutButton';
import {
  BellIcon,
  ContactsIcon,
  FileTextIcon,
  GlobeIcon,
  HelpCircleIcon,
  MoonIcon,
  ShieldIcon,
  SlidersIcon,
} from '@/components/settings/icons';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { isDark, toggleMode } = useTheme();
  const colors = useSettingsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [notificationsPaused, setNotificationsPaused] = useState(true);

  const showComingSoon = (title: string) => {
    Alert.alert(title, 'Esta seção estará disponível em breve.');
  };

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair agora', style: 'destructive', onPress: () => { void logout(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <SettingsTopBar onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsGroup>
          <SettingsProfileCard
            name={mockProfile.name}
            username={mockProfile.username}
            avatarUrl={mockProfile.avatarUrl}
            onPress={() => router.push('/edit-profile')}
          />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsItem
            icon={BellIcon}
            label="Pausar notificações"
            trailing={
              <SettingsToggle
                value={notificationsPaused}
                onValueChange={setNotificationsPaused}
              />
            }
          />
          <SettingsItem
            icon={SlidersIcon}
            label="Configurações gerais"
            onPress={() => showComingSoon('Configurações gerais')}
          />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsItem
            icon={MoonIcon}
            label="Modo escuro"
            trailing={<SettingsToggle value={isDark} onValueChange={toggleMode} />}
          />
          <SettingsItem
            icon={GlobeIcon}
            label="Idioma"
            onPress={() => showComingSoon('Idioma')}
          />
          <SettingsItem
            icon={ContactsIcon}
            label="Meus contatos"
            onPress={() => showComingSoon('Meus contatos')}
          />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsItem
            icon={HelpCircleIcon}
            label="Perguntas frequentes"
            onPress={() => showComingSoon('Perguntas frequentes')}
          />
          <SettingsItem
            icon={FileTextIcon}
            label="Termos de serviço"
            onPress={() => showComingSoon('Termos de serviço')}
          />
          <SettingsItem
            icon={ShieldIcon}
            label="Política do usuário"
            onPress={() => showComingSoon('Política do usuário')}
          />
        </SettingsGroup>
      </ScrollView>

      <View style={styles.footer}>
        <LogoutButton onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: SettingsPalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.screen,
      paddingHorizontal: 18,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      gap: 14,
      paddingBottom: 16,
    },
    footer: {
      paddingTop: 8,
      paddingBottom: 8,
    },
  });
