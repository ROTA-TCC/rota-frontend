import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';

const ACTIVITIES = [
  {
    id: '1',
    title: 'Morning Run - Riverside',
    date: 'Hoje, 06:30',
    distance: '5.2 km',
    time: '28:14',
    pace: "5'25/km",
    type: 'run',
  },
  {
    id: '2',
    title: 'Evening Cycling',
    date: 'Ontem, 18:45',
    distance: '24.5 km',
    time: '1:12:00',
    pace: '20.4 km/h',
    type: 'bike',
  },
];

export function ActivityHistory() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico Recente</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {ACTIVITIES.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.7}>
            <View style={styles.iconWrapper}>
              <FontAwesome6 
                name={item.type === 'run' ? 'person-running' : 'person-biking'} 
                size={16} 
                color="#111111" 
              />
            </View>
            
            <View style={styles.info}>
              <Text style={styles.activityTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.activityDate}>{item.date}</Text>
            </View>

            <View style={styles.metrics}>
              <Text style={styles.distance}>{item.distance}</Text>
              <Text style={styles.pace}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  seeAll: {
    color: '#D4ED6D',
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 14,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D4ED6D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  activityDate: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
  metrics: {
    alignItems: 'flex-end',
    gap: 4,
  },
  distance: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pace: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
});
