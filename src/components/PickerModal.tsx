import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.45;
const ITEM_HEIGHT = 50;
const PICKER_HEIGHT = 210;
const PICKER_PADDING = (PICKER_HEIGHT - ITEM_HEIGHT) / 2;

const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);

interface PickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  onSelect: (item: string) => void;
}

interface PickerItemProps {
  item: string;
  index: number;
  scrollY: Animated.SharedValue<number>;
  accentColor: string;
}

const PickerItem: React.FC<PickerItemProps> = ({ item, index, scrollY, accentColor }) => {
  const animatedContainerStyle = useAnimatedStyle(() => {
    const itemOffset = index * ITEM_HEIGHT;
    const distance = Math.abs(scrollY.value - itemOffset);

    const scale = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1.15, 0.9, 0.75],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1, 0.45, 0.2],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const itemOffset = index * ITEM_HEIGHT;
    const distance = Math.abs(scrollY.value - itemOffset);
    const isSelected = distance < ITEM_HEIGHT / 2;

    return {
      color: isSelected ? accentColor : '#A0A0A0',
    };
  });

  return (
    <Animated.View style={[styles.pickerItem, animatedContainerStyle]}>
      <AnimatedThemedText style={[styles.pickerItemText, animatedTextStyle]}>
        {item}
      </AnimatedThemedText>
    </Animated.View>
  );
};

export const PickerModal: React.FC<PickerModalProps> = ({
  isVisible,
  onClose,
  title,
  items,
  onSelect,
}) => {
  const accentColor = Colors.dark.tint; // #ff9a00
  const translateY = useSharedValue(SHEET_HEIGHT);
  const scrollY = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<string>>(null);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 22, stiffness: 200 });
      scrollY.value = 0;
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    } else {
      translateY.value = withSpring(SHEET_HEIGHT, { damping: 22, stiffness: 200 });
    }
  }, [isVisible]);

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, SHEET_HEIGHT],
      [0.8, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleClose = () => {
    translateY.value = withSpring(SHEET_HEIGHT, { damping: 22, stiffness: 200 }, () => {
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

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SHEET_HEIGHT / 3 || event.velocityY > 500) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withSpring(0, { damping: 22, stiffness: 200 });
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
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.bottomSheet, sheetStyle]}>
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <TouchableOpacity onPress={handleSave} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <ThemedText style={[styles.saveText, { color: accentColor }]}>Salvar</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Picker Wheel Container */}
          <View style={styles.pickerContainer}>
            {/* 1. Imagem de Iluminação Suave no Fundo */}
            <Image
              source={require('../../assets/images/ambient-light.png')}
              style={styles.ambientGlowImage}
              resizeMode="cover"
            />

            {/* 2. Faixa Gradual de Seleção Central */}
            <Image
              source={require('../../assets/images/selection-strip.png')}
              style={styles.selectionStripImage}
              resizeMode="stretch"
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
      </GestureDetector>
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
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    zIndex: 101,
  },
  dragHandle: {
    width: 36,
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
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  cancelText: { color: '#888888', fontWeight: '600', fontSize: 15 },
  title: { color: 'white', fontWeight: '700', fontSize: 16 },
  saveText: { fontWeight: '700', fontSize: 15 },
  pickerContainer: {
    backgroundColor: '#0A0A0A',
    height: PICKER_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  ambientGlowImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.45,
    zIndex: 0,
  },
  selectionStripImage: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    width: '100%',
    height: ITEM_HEIGHT + 8,
    transform: [{ translateY: -(ITEM_HEIGHT + 8) / 2 }],
    zIndex: 1,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  pickerItemText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
