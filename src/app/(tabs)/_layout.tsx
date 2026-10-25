import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

export default function TabLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDark ? '#070707' : '#FFFFFF',
            borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          },
        ],
        tabBarActiveTintColor: '#E34F1E',
        tabBarInactiveTintColor: isDark ? '#999999' : '#8E8E93',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <Ionicons name="map-outline" size={24} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: '',
          tabBarAccessibilityLabel: 'Gravar atividade',
          tabBarButtonTestID: 'record-tab',
          tabBarIcon: () => (
            <View style={styles.recordButton}>
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboards"
        options={{
          title: 'Rankings',
          tabBarIcon: ({ color }) => <Ionicons name="trophy-outline" size={24} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarButtonTestID: 'profile-tab',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color as string} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: 70,
    paddingTop: 8,
    paddingBottom: 8,
  },
  recordButton: {
    backgroundColor: '#E34F1E',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
