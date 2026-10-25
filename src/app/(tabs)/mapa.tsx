import React, { useMemo, useState } from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { GoogleMap } from '@/components/map/GoogleMap';
import { MapSearchBar } from '@/components/map/MapSearchBar';
import { MapFilterCarousel } from '@/components/map/MapFilterCarousel';
import { MapFab } from '@/components/map/MapFab';
import { MapRouteCarousel } from '@/components/map/MapRouteCarousel';
import { MapBottomSheet } from '@/components/map/MapBottomSheet';
import { useTheme } from '@/providers/ThemeProvider';

export default function MapaScreen() {
  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeOption, setActiveOption] = useState('rotas');

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <GoogleMap
        center={[-23.55052, -46.633308]}
        zoom={13}
        style={styles.map}
      />

      <View style={styles.uiLayer} pointerEvents="box-none">
        <View pointerEvents="box-none" style={styles.topSection}>
          <View style={styles.searchWrapper}>
            <MapSearchBar />
          </View>
          <View style={styles.filterWrapper}>
            <MapFilterCarousel
              onFilterPress={(filter) => {
                if (filter === 'Rotas') {
                  setSheetVisible(true);
                }
              }}
            />
          </View>
        </View>

        <View pointerEvents="box-none" style={styles.bottomSection}>
          <MapFab />
          <MapRouteCarousel />
        </View>
      </View>

      {sheetVisible && (
        <MapBottomSheet
          activeOption={activeOption}
          onSelect={(id) => {
            setActiveOption(id);
            setSheetVisible(false);
          }}
          onClose={() => setSheetVisible(false)}
        />
      )}
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#F5F5F7',
    },
    map: {
      flex: 1,
    },
    uiLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'space-between',
      paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 54,
      paddingBottom: 16,
      zIndex: 10,
    },
    topSection: {
      width: '100%',
    },
    bottomSection: {
      width: '100%',
    },
    searchWrapper: {
      paddingHorizontal: 16,
    },
    filterWrapper: {
      marginTop: 12,
    },
  });
