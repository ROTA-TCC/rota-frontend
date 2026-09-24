import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ProfileHeader() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.8}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' }} 
          style={styles.avatar} 
        />
        <View style={styles.cameraIconWrapper}>
          <Ionicons name="camera" size={16} color="#050505" />
        </View>
      </TouchableOpacity>
      
      <Text style={styles.name}>Sarah Jenkins</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 60, // "Quase" redondo, mais quadrado nas bordas
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
});
