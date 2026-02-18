import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Skeleton } from '../../src/components/ui/Skeleton';
import { supabase } from '../../src/services/supabase';
import { useCartStore } from '../../src/store/useCartStore';
import { useThemeStore } from '../../src/store/useThemeStore';
import { Product } from '../../src/types';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { theme } = useThemeStore();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoScrollTimer = useRef<any>(null);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  // Determine images to display
  const productImages = product?.images && product.images.length > 0 
    ? product.images 
    : product?.image_url ? [product.image_url] : [];

  // Auto-scroll logic
  useEffect(() => {
    if (isAutoScrolling && productImages.length > 1) {
      autoScrollTimer.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % productImages.length;
        scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        setActiveIndex(nextIndex);
      }, 3500);
    }

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [isAutoScrolling, activeIndex, productImages.length]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      if (!id) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    setActiveIndex(index);
  };

  const onScrollBeginDrag = () => {
    setIsAutoScrolling(false);
  };

  const onScrollEndDrag = () => {
    // Resume auto-scroll after a short delay
    setTimeout(() => setIsAutoScrolling(true), 1000);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      alert('เพิ่มลงตะกร้าเรียบร้อยแล้วครับ!');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <Skeleton height={450} borderRadius={0} />
        <View style={[styles.infoContainer, { backgroundColor: Colors[theme].background }]}>
          <Skeleton width="30%" height={16} style={{ marginBottom: 12 }} />
          <Skeleton width="80%" height={32} style={{ marginBottom: 12 }} />
          <Skeleton width="40%" height={32} style={{ marginBottom: 24 }} />
          <View style={[styles.divider, { backgroundColor: Colors[theme].divider }]} />
          <Skeleton width="50%" height={24} style={{ marginBottom: 16 }} />
          <Skeleton width="90%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="85%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="95%" height={16} />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: Colors[theme].background }]}>
        <Ionicons name="search-outline" size={80} color={Colors[theme].subtext} />
        <Text style={[styles.notFoundText, { color: Colors[theme].subtext }]}>ไม่พบข้อมูลสินค้าที่คุณต้องการครับ</Text>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]} onPress={() => router.back()}>
          <Text style={[styles.backButtonText, { color: Colors[theme].text }]}>ย้อนกลับไปหน้าหลัก</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <Stack.Screen options={{ 
        title: product.name, 
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: Colors[theme].background },
        headerTintColor: Colors[theme].text,
        headerShadowVisible: false,
      }} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Image Carousel */}
        <View style={[styles.imageCarouselContainer, { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F9F9F9' }]}>
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            pagingEnabled 
            nestedScrollEnabled={true}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
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
                    activeIndex === index && [styles.activeDot, { backgroundColor: Colors[theme].tint }]
                  ]} 
                />
              ))}
            </View>
          )}
        </View>
        
        <View style={[styles.infoContainer, { backgroundColor: Colors[theme].background }]}>
          <Text style={[styles.category, { color: Colors[theme].subtext }]}>{product.category}</Text>
          <Text style={[styles.name, { color: Colors[theme].text }]}>{product.name}</Text>
          <Text style={[styles.price, { color: Colors[theme].tint }]}>{product.price.toLocaleString()} ฿</Text>
          
          <View style={[styles.divider, { backgroundColor: Colors[theme].divider }]} />
          
          <Text style={[styles.descriptionTitle, { color: Colors[theme].text }]}>รายละเอียดสินค้า</Text>
          <Text style={[styles.description, { color: Colors[theme].subtext }]}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: Colors[theme].card, borderTopColor: Colors[theme].divider }]}>
        <TouchableOpacity style={styles.addToCartButtonWrapper} onPress={handleAddToCart} activeOpacity={0.9}>
          <LinearGradient
            colors={[Colors[theme].tint, Colors[theme].tint]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addToCartButton}
          >
            <Ionicons name="cart-outline" size={24} color="#fff" />
            <Text style={styles.addToCartText}>เพิ่มลงตะกร้า</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 450,
    position: 'relative',
  },
  image: {
    width: width,
    height: 450,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(128, 128, 128, 0.4)',
    marginHorizontal: 3,
  },
  activeDot: {
    width: 24,
  },
  infoContainer: {
    padding: 28,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -30,
    minHeight: 500,
  },
  category: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    fontFamily: 'Kanit_400Regular',
  },
  name: {
    fontSize: 28,
    marginBottom: 12,
    lineHeight: 34,
    fontFamily: 'Kanit_700Bold',
  },
  price: {
    fontSize: 32,
    marginBottom: 24,
    fontFamily: 'Kanit_700Bold',
  },
  divider: {
    height: 1,
    marginVertical: 20,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontFamily: 'Kanit_700Bold',
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    fontFamily: 'Kanit_400Regular',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
  },
  addToCartButtonWrapper: {
    elevation: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  addToCartButton: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'Kanit_700Bold',
  },
  notFoundText: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 30,
    fontFamily: 'Kanit_400Regular',
  },
  backButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Kanit_700Bold',
  },
});
