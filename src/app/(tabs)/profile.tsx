import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar, Text } from 'react-native';
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

      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Perfil</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />

        <ProfileListCard title="Preferências da Conta" items={accountSettings} />
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
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    alignItems: 'center',
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
});

