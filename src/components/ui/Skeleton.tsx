import { Colors } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}) => {
  const { theme } = useThemeStore();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const sharedAnimationConfig = {
      duration: 1000,
      useNativeDriver: true,
    };

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 1,
        }),
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 0.3,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View 
      style={[
        styles.skeleton, 
        { 
          width: width as any, 
          height: height as any, 
          borderRadius, 
          opacity: pulseAnim,
          backgroundColor: Colors[theme].skeleton
        }, 
        style
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
  },
});
