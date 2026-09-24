import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import MapView from 'react-native-maps';
import { MapSearchBar } from '@/components/map/MapSearchBar';
import { MapFilterCarousel } from '@/components/map/MapFilterCarousel';
import { MapFab } from '@/components/map/MapFab';
import { MapRouteCarousel } from '@/components/map/MapRouteCarousel';
import { MapBottomSheet } from '@/components/map/MapBottomSheet';

export default function MapaScreen() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeOption, setActiveOption] = useState('rotas');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. O Mapa fica ao fundo */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      {/* 2. Camada de UI flutuante sobreposta */}
      <View style={styles.overlay} pointerEvents="box-none">
        <SafeAreaView style={styles.safeArea}>
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

          <MapFab />
          
          <MapRouteCarousel />
        </SafeAreaView>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070707' },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'space-between' 
  },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  searchWrapper: { paddingHorizontal: 16, marginTop: 20 },
  filterWrapper: { marginTop: 12 },
});