import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  runOnJS 
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.45;

interface PickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  onSelect: (item: string) => void;
}

export const PickerModal: React.FC<PickerModalProps> = ({ 
  isVisible, 
  onClose, 
  title, 
  items,
  onSelect
}) => {
  const translateY = useSharedValue(SHEET_HEIGHT);

  React.useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0);
    } else {
      translateY.value = withSpring(SHEET_HEIGHT);
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SHEET_HEIGHT / 3) {
        translateY.value = withSpring(SHEET_HEIGHT, {}, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0);
      }
    });

  return (
    <>
      {isVisible && (
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      )}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, animatedStyle]}>
          <View style={styles.dragHandle} />
          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={styles.saveText}>Salvar</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickerContainer}>
            <View style={styles.ambientGlow} />
            <View style={styles.selectionBar} />
            <FlatList
              data={items}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.pickerItem}>
                  <ThemedText style={styles.pickerItemText}>{item}</ThemedText>
                </View>
              )}
              snapToInterval={50}
              decelerationRate="fast"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 100, paddingBottom: 100 }}
            />
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 100,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#151515',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    zIndex: 101,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  cancelText: { color: 'white', fontWeight: '600', fontSize: 15 },
  title: { color: 'white', fontWeight: '700', fontSize: 16 },
  saveText: { color: '#A5B85C', fontWeight: '600', fontSize: 15 },
  pickerContainer: {
    backgroundColor: '#070707',
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    height: 60,
    backgroundColor: '#070C08',
    borderRadius: 40,
    transform: [{ translateY: -30 }],
    zIndex: 0,
  },
  selectionBar: {
    position: 'absolute',
    top: '50%',
    height: 52,
    left: 0,
    right: 0,
    transform: [{ translateY: -26 }],
    backgroundColor: 'rgba(165, 184, 92, 0.15)',
    zIndex: 1,
  },
  pickerItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  pickerItemText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
  },
});
