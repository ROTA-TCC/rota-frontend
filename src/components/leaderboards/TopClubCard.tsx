import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export const TopClubCard = ({ title, name, members }: { title: string, name: string, members: number }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
      <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
    </View>
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.clubIcon}>
          <FontAwesome5 name="sun" size={20} color="#FF7B31" />
        </View>
        <View>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.clubSub}>
            <FontAwesome5 name="user" size={10} color="#8E8E93" />
            <Text style={styles.sub}>{members.toLocaleString()} members</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#151517', borderRadius: 20, padding: 20, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  clubIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1F1F22', justifyContent: 'center', alignItems: 'center' },
  name: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  sub: { color: '#8E8E93', fontSize: 12, fontWeight: '600' },
  clubSub: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});