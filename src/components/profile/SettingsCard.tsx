import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SettingsCard = () => {
  const settings = [
    { icon: 'notifications-outline', title: 'Notificações' },
    { icon: 'lock-closed-outline', title: 'Privacidade' },
    { icon: 'person-outline', title: 'Conta' },
    { icon: 'shield-outline', title: 'Segurança' },
    { icon: 'help-circle-outline', title: 'Ajuda e Suporte' },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Configurações</Text>
      
      {settings.map((item, index) => (
        <View key={index} style={styles.settingItem}>
          <View style={styles.iconWrapper}>
            <Ionicons name={item.icon as any} size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.settingText}>{item.title}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
