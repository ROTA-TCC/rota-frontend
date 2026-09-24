import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileHeader } from '@/components/profile/ProfileHeader';

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
        
        {/* Seção de Configurações como cards estáticos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configurações</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.iconWrapper}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Notificações</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.iconWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Privacidade</Text>
          </View>
        </View>

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
  card: { 
    backgroundColor: '#151517', 
    borderRadius: 20, 
    padding: 20, 
    gap: 20 
  },
  cardTitle: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '700' 
  },
});
