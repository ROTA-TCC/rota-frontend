import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useMapColors, type MapPalette } from '@/constants/mapTheme';
import { SportDropdown } from './SportDropdown';

export const MapSearchBar = () => {
  const colors = useMapColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeSport, setActiveSport] = useState('corrida');

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity
          style={styles.brandSection}
          onPress={() => setDropdownVisible(!dropdownVisible)}
          activeOpacity={0.7}
        >
          <FontAwesome5
            name={activeSport === 'corrida' ? 'shoe-prints' : 'running'}
            size={18}
            color={colors.accent}
            style={activeSport === 'corrida' ? { transform: [{ rotate: '-30deg' }] } : undefined}
          />
          <Ionicons
            name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
            size={11}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.searchText}>Procurar locais</Text>

        <TouchableOpacity style={styles.savedBtn} activeOpacity={0.7}>
          <Ionicons name="bookmark-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.savedText}>Salvo</Text>
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <SportDropdown
          activeSport={activeSport}
          onSelect={setActiveSport}
          onClose={() => setDropdownVisible(false)}
        />
      )}
    </View>
  );
};

const createStyles = (colors: MapPalette) =>
  StyleSheet.create({
    container: {},
    searchBar: {
      backgroundColor: colors.surface,
      height: 52,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    brandSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingRight: 14,
      borderRightWidth: 1.5,
      borderRightColor: colors.border,
      marginRight: 14,
    },
    searchText: {
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: '600',
      flex: 1,
    },
    savedBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    savedText: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
  });
