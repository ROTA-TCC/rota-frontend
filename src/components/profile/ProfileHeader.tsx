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
      
      <View style={styles.locationWrapper}>
        <Ionicons name="location" size={14} color="#D4ED6D" />
        <Text style={styles.location}>Sydney, Australia</Text>
      </View>
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
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
});
