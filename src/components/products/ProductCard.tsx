import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { theme } = useThemeStore();
  
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(product)} activeOpacity={0.8}>
      <View style={[styles.innerContainer, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
        <View style={[styles.imageContainer, { backgroundColor: Colors[theme].skeleton }]}>
          <Image source={{ uri: product.image_url }} style={styles.image} contentFit="cover" />
          {product.stock <= 5 && product.stock > 0 && (
            <View style={[styles.stockBadge, { backgroundColor: `${Colors[theme].tint}E6` }]}>
              <Text style={styles.stockText}>เหลือเพียง {product.stock}</Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text style={[styles.category, { color: Colors[theme].subtext }]}>{product.category}</Text>
          <Text style={[styles.name, { color: Colors[theme].text }]} numberOfLines={2}>{product.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: Colors[theme].tint }]}>{product.price.toLocaleString()} ฿</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    maxWidth: '48%',
    marginBottom: 20,
    marginHorizontal: 8,
    // Slightly brighter shadow/glow for dark backgrounds
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  innerContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  stockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Kanit_700Bold',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'Kanit_500Medium',
    height: 40, // Ensure fixed height for 2 lines alignment
  },
  category: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontFamily: 'Kanit_400Regular',
    letterSpacing: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Kanit_700Bold',
  },
});
