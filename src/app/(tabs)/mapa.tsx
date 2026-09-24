import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, SafeAreaView, StatusBar } from 'react-native';
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
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80' }} 
        style={styles.mapBackground}
      />
      
      <SafeAreaView style={styles.overlay}>
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
  mapBackground: { position: 'absolute', width: '100%', height: '100%' },
  overlay: { flex: 1 },
  searchWrapper: { paddingHorizontal: 16, marginTop: 20 },
  filterWrapper: { marginTop: 12 },
});