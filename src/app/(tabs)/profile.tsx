import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileListCard } from '@/components/profile/ProfileListCard';

export default function ProfileScreen() {
  const accountSettings = [
    { icon: 'person-outline', title: 'Informações Pessoais' },
    { icon: 'notifications-outline', title: 'Notificações' },
    { icon: 'lock-closed-outline', title: 'Privacidade' },
    { icon: 'shield-outline', title: 'Segurança' },
  ];

  const supportSettings = [
    { icon: 'help-circle-outline', title: 'Ajuda e Suporte' },
    { icon: 'document-text-outline', title: 'Termos de Uso' },
    { icon: 'information-circle-outline', title: 'Sobre' },
    { icon: 'log-out-outline', title: 'Sair' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />

        <View style={styles.settingsSection}>
          <ProfileListCard title="Preferências da Conta" items={accountSettings} />
        </View>
        <ProfileListCard title="Suporte e Legal" items={supportSettings} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050505',
  },
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 24,
  },
  settingsSection: {
    marginTop: 30, // Aumenta o espaçamento
  },
});

