import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export const MapFab = () => {
  const [active, setActive] = useState(false);

  return (
    <View style={styles.container}>
      {active && (
        <>
          <View style={[styles.subFab, styles.layer3]}>
            <Ionicons name="layers" size={18} color="white" />
            <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
          </View>
          <View style={[styles.subFab, styles.layer2]}><Ionicons name="locate" size={18} color="white" /></View>
          <View style={[styles.subFab, styles.layer1]}><FontAwesome5 name="pencil-alt" size={18} color="white" /></View>
        </>
      )}
      <TouchableOpacity style={styles.mainFab} onPress={() => setActive(!active)}>
        <Ionicons name="ellipsis-horizontal" size={22} color="white" style={{ transform: [{ rotate: '-90deg' }] }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', right: 16, bottom: 235, width: 48, height: 48 },
  mainFab: { width: 48, height: 48, backgroundColor: '#070707', borderRadius: 24, justifyContent: 'center', alignItems: 'center', zIndex: 5, shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 12 },
  subFab: { position: 'absolute', bottom: 0, right: 0, width: 48, height: 48, backgroundColor: 'rgba(15, 15, 15, 0.95)', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  layer1: { transform: [{ translateY: -60 }] },
  layer2: { transform: [{ translateY: -120 }] },
  layer3: { transform: [{ translateY: -180 }] },
  badge: { position: 'absolute', top: -2, right: -2, backgroundColor: 'white', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'black', fontSize: 11, fontWeight: '800' },
});