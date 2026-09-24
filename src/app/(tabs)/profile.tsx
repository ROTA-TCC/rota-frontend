import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { GoalCard } from '@/components/profile/GoalCard';
import { ActivityHistory } from '@/components/profile/ActivityHistory';

export default function ProfileScreen() {
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
        
        {/* Nova seção de Configurações inspirada no Leaderboard */}
        <View style={styles.configCard}>
          <TouchableOpacity style={styles.configItem} activeOpacity={0.7}>
            <View style={styles.configIconWrapper}>
              <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.configText}>Configurações</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <ProfileStats />
        <GoalCard />
        <ActivityHistory />
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
    paddingBottom: 40,
    gap: 24,
    paddingHorizontal: 20,
  },
  configCard: {
    backgroundColor: '#151517',
    borderRadius: 20,
    padding: 16,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  configIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
  },
  configText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});
