import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ListItem {
  icon: string;
  title: string;
}

interface ProfileListCardProps {
  title: string;
  items: ListItem[];
}

export const ProfileListCard = ({ title, items }: ProfileListCardProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {items.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.item, index !== items.length - 1 && styles.itemBorder]} 
            activeOpacity={0.7}
          >
            <View style={styles.itemLeft}>
              <View style={styles.iconWrapper}>
                <Ionicons name={item.icon as any} size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 4,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#151517',
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2E',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
