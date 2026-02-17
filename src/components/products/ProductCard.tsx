import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(product)} activeOpacity={0.8}>
      <Image source={{ uri: product.image_url }} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>{product.price.toLocaleString()} ฿</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 8,
    flex: 1,
    maxWidth: '48%',
    // Premium Shadows
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#E91E63',
  },
});
