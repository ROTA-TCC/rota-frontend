import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export type ConfettiRef = {
  fire: () => void;
};

type ConfettiProps = {
  count ? : number;
  origin ? : { x: number;y: number };
  manualstart ? : boolean;
  fadeOut ? : boolean;
  colors ? : string[];
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const Confetti = forwardRef < ConfettiRef,
  ConfettiProps > ((props, ref) => {
    const {
      count = 50,
        origin = { x: SCREEN_WIDTH / 2, y: -10 },
        manualstart = false,
        fadeOut = true,
        colors = ['#3B5B8E', '#FFD700', '#9ED872', '#FF453A', '#007AFF'],
    } = props;
    
    const cannonRef = useRef < ConfettiCannon | null > (null);
    
    const fire = () => {
      cannonRef.current?.start();
    };
    
    useImperativeHandle(ref, () => ({
      fire,
    }));
    
    useEffect(() => {
      if (!manualstart) {
        fire();
      }
    }, [manualstart]);
    
    return (
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <ConfettiCannon
        ref={cannonRef}
        count={count}
        origin={origin}
        autoStart={!manualstart}
        fadeOut={fadeOut}
        colors={colors}
      />
    </View>
    );
  });

Confetti.displayName = 'Confetti';