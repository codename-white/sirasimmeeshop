import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCartStore } from '../../src/store/useCartStore';
import { Product } from '../../src/types';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    // ... rest of fetch logic
  };

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    setActiveIndex(index);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      alert('เพิ่มลงตะกร้าเรียบร้อยแล้วครับ!');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>ไม่พบข้อมูลสินค้าครับ</Text>
      </View>
    );
  }

  // Determine images to display (use images array if exists, fallback to image_url)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name, headerTitleAlign: 'center' }} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Image Carousel */}
        <View style={styles.imageCarouselContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {productImages.map((img, index) => (
              <Image 
                key={index} 
                source={{ uri: img }} 
                style={styles.image} 
                contentFit="contain" 
              />
            ))}
          </ScrollView>
          {productImages.length > 1 && (
            <View style={styles.imagePagination}>
              {productImages.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.dot, 
                    activeIndex === index && styles.activeDot
                  ]} 
                />
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price.toLocaleString()} ฿</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>รายละเอียดสินค้า</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <Text style={styles.addToCartText}>เพิ่มลงตะกร้า</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageCarouselContainer: {
    width: width,
    height: 400,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  image: {
    width: width,
    height: 400,
  },
  imagePagination: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 20, // Slim bar style
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  activeDot: {
    width: 35, // Longer bar for active
    backgroundColor: '#fff',
  },
  infoContainer: {
    padding: 20,
  },
  category: {
    fontSize: 14,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    backgroundColor: '#E91E63',
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
