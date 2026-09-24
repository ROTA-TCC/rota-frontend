import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export function ProfileStats() {
  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.number}>1.2k</Text>
        <Text style={styles.label}>Seguidores</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statBox}>
        <Text style={styles.number}>450</Text>
        <Text style={styles.label}>Seguindo</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statBox}>
        <Text style={styles.number}>124</Text>
        <Text style={styles.label}>Atividades</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#151515',
    borderRadius: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  number: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  label: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 4,
  },
});
