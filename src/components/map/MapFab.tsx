import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../themed-text';

export const MapFab = () => {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleFab = () => {
    if (active) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setActive(false);
        setVisible(false);
      });
    } else {
      setActive(true);
      setVisible(true);
      Animated.spring(animation, {
        toValue: 1,
        friction: 6,
        tension: 45,
        useNativeDriver: true,
      }).start();
    }
  };

  const translateY1 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -60],
  });

  const translateY2 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  const translateY3 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -180],
  });

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const rotateMain = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      {visible && (
        <>
          <Animated.View
            style={[
              styles.subFab,
              {
                opacity: animation,
                transform: [{ translateY: translateY3 }, { scale }],
              },
            ]}
          >
            <Ionicons name="layers" size={18} color="white" />
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>1</ThemedText>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.subFab,
              {
                opacity: animation,
                transform: [{ translateY: translateY2 }, { scale }],
              },
            ]}
          >
            <Ionicons name="locate" size={18} color="white" />
          </Animated.View>

          <Animated.View
            style={[
              styles.subFab,
              {
                opacity: animation,
                transform: [{ translateY: translateY1 }, { scale }],
              },
            ]}
          >
            <FontAwesome5 name="pencil-alt" size={18} color="white" />
          </Animated.View>
        </>
      )}

      <TouchableOpacity style={styles.mainFab} onPress={toggleFab} activeOpacity={0.8}>
        <Animated.View style={{ transform: [{ rotate: rotateMain }] }}>
          <Ionicons name="ellipsis-horizontal" size={22} color="white" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 235,
    width: 48,
    height: 48,
  },
  mainFab: {
    width: 48,
    height: 48,
    backgroundColor: '#070707',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  subFab: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 48,
    height: 48,
    backgroundColor: 'rgba(15, 15, 15, 0.95)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'white',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'black',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 18,
    includeFontPadding: false,
  },
});
