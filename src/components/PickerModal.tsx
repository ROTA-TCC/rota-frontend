import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image, FlatList } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.42;
const ITEM_HEIGHT = 48;
const PICKER_HEIGHT = 200;
const PICKER_PADDING = (PICKER_HEIGHT - ITEM_HEIGHT) / 2;

const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);

interface PickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  min: number;
  max: number;
  step?: number;
  decimals?: number;
  unit?: string;
  selectedValue?: string;
  initialValue?: string;
  onSelect: (value: string) => void;
}

interface PickerItemProps {
  item: string;
  index: number;
  scrollY: Animated.SharedValue<number>;
  accentColor: string;
}

const PickerItem: React.FC<PickerItemProps> = ({ item, index, scrollY, accentColor }) => {
  const animatedTextStyle = useAnimatedStyle(() => {
    const itemOffset = index * ITEM_HEIGHT;
    const distance = Math.abs(scrollY.value - itemOffset);

    const opacity = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1, 0.4, 0.15],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1.1, 0.95, 0.85],
      Extrapolation.CLAMP
    );

    const isSelected = distance < ITEM_HEIGHT / 2;

    return {
      opacity,
      transform: [{ scale }],
      color: isSelected ? accentColor : '#888888',
    };
  });

  return (
    <View style={styles.pickerItem}>
      <AnimatedThemedText style={[styles.pickerItemText, animatedTextStyle]}>
        {item}
      </AnimatedThemedText>
    </View>
  );
};

export const PickerModal: React.FC<PickerModalProps> = ({
  isVisible,
  onClose,
  title,
  min,
  max,
  step = 1,
  decimals = 0,
  unit = '',
  selectedValue,
  initialValue,
  onSelect,
}) => {
  const accentColor = Colors.dark.tint;
  const translateY = useSharedValue(SHEET_HEIGHT);
  const scrollY = useSharedValue(0);
  const flatListRef = useRef<FlatList<string>>(null);

  // Gerar lista de itens baseado no min, max, step e unit
  const items = useMemo(() => {
    const list: string[] = [];
    for (let val = min; val <= max + 0.0001; val += step) {
      const formatted = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
      list.push(unit ? `${formatted} ${unit}` : formatted);
    }
    return list;
  }, [min, max, step, decimals, unit]);

  // Identificar item atualmente focado/selecionado
  const activeValue = selectedValue || initialValue || items[0];
  const initialIndex = useMemo(() => {
    const idx = items.indexOf(activeValue);
    return idx !== -1 ? idx : 0;
  }, [items, activeValue]);

  useEffect(() => {
    if (isVisible) {
      // Animação simples de subida
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.out(Easing.quad),
      });

      const targetOffset = initialIndex * ITEM_HEIGHT;
      scrollY.value = targetOffset;

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: targetOffset, animated: false });
      }, 50);
    } else {
      // Animação simples de descida
      translateY.value = withTiming(SHEET_HEIGHT, {
        duration: 200,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [isVisible, initialIndex]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, SHEET_HEIGHT],
      [0.7, 0],
      Extrapolation.CLAMP
    ),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleClose = () => {
    translateY.value = withTiming(SHEET_HEIGHT, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  const handleSave = () => {
    const selectedIndex = Math.round(scrollY.value / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, selectedIndex));
    if (items[clampedIndex]) {
      onSelect(items[clampedIndex]);
    }
  };

  // Gesto Pan apenas para a área da aba superior / arrasto
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 80 || event.velocityY > 500) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withTiming(0, { duration: 200 });
      }
    });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
      </Animated.View>

      {/* Sheet Container */}
      <Animated.View style={[styles.bottomSheet, sheetStyle]}>
        {/* Top bar com detector de arrasto */}
        <GestureDetector gesture={panGesture}>
          <View style={styles.dragZone}>
            <View style={styles.dragHandle} />
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={handleClose} hitSlop={12}>
                <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.title}>{title}</ThemedText>
              <TouchableOpacity onPress={handleSave} hitSlop={12}>
                <ThemedText style={[styles.saveText, { color: accentColor }]}>Salvar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </GestureDetector>

        {/* Picker Container com Rolagem */}
        <View style={styles.pickerContainer}>
          {/* Fundo Iluminação */}
          <Image
            source={require('../../assets/images/ambient-light.png')}
            style={styles.ambientGlowImage}
            resizeMode="cover"
            pointerEvents="none"
          />

          {/* Faixa Central com Transparência */}
          <Image
            source={require('../../assets/images/selection-strip.png')}
            style={styles.selectionStripImage}
            resizeMode="stretch"
            pointerEvents="none"
          />

          <Animated.FlatList
            ref={flatListRef}
            data={items}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <PickerItem
                item={item}
                index={index}
                scrollY={scrollY}
                accentColor={accentColor}
              />
            )}
            onScroll={onScroll}
            scrollEventThrottle={16}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: PICKER_PADDING,
              paddingBottom: PICKER_PADDING,
            }}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
          />
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 100,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#151515',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 101,
  },
  dragZone: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  cancelText: { color: '#888888', fontWeight: '600', fontSize: 15 },
  title: { color: 'white', fontWeight: '700', fontSize: 16 },
  saveText: { fontWeight: '700', fontSize: 15 },
  pickerContainer: {
    backgroundColor: '#080808',
    height: PICKER_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  ambientGlowImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.35,
  },
  selectionStripImage: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    width: '100%',
    height: ITEM_HEIGHT + 6,
    transform: [{ translateY: -(ITEM_HEIGHT + 6) / 2 }],
    opacity: 0.6, // Transparência aplicada na faixa de seleção
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
