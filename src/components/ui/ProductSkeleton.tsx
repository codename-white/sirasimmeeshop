import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { Skeleton } from './Skeleton';

export const ProductSkeleton: React.FC = () => {
  const { theme } = useThemeStore();
  
  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
      <Skeleton height={180} borderRadius={20} />
      <View style={styles.content}>
        <Skeleton width="40%" height={12} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={20} style={{ marginBottom: 16 }} />
        <Skeleton width="60%" height={24} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: '48%',
    borderRadius: 20,
    marginBottom: 16,
    marginHorizontal: 8,
    borderWidth: 1,
  },
  content: {
    padding: 16,
  },
});

