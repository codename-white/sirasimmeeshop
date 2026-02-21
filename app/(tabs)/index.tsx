import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '../../src/components/products/ProductCard';
import { ProductSkeleton } from '../../src/components/ui/ProductSkeleton';
import { Skeleton } from '../../src/components/ui/Skeleton';
import { supabase } from '../../src/services/supabase';
import { useThemeStore } from '../../src/store/useThemeStore';
import { Product } from '../../src/types';

const { width } = Dimensions.get('window');

const bannerVideoSource = require('../../assets/simmee/gapbo.mp4');

export default function HomeScreen() {
  const { theme } = useThemeStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const player = useVideoPlayer(bannerVideoSource, (player) => {
    player.loop = true;
    player.play();
    player.muted = true;
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('ผิดพลาด', 'ไม่สามารถดึงข้อมูลสินค้าได้ครับ');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (loading && products.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <View style={styles.header}>
          <Skeleton width="40%" height={20} style={{ marginBottom: 8 }} />
          <Skeleton width="70%" height={40} style={{ marginBottom: 20 }} />
          <Skeleton height={200} borderRadius={24} style={{ marginBottom: 30 }} />
          <Skeleton width="60%" height={30} style={{ marginBottom: 15 }} />
        </View>
        <View style={styles.columnWrapper}>
          <ProductSkeleton />
          <ProductSkeleton />
        </View>
        <View style={styles.columnWrapper}>
          <ProductSkeleton />
          <ProductSkeleton />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.welcomeText, { color: Colors[theme].subtext }]}>ยินดีต้อนรับสู่</Text>
            <Text style={[styles.shopName, { color: Colors[theme].text }]}>Shopsirasimmee 🍿</Text>
            
            <View style={styles.bannerContainer}>
              <VideoView
                player={player}
                style={styles.bannerVideo}
                nativeControls={false}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bannerOverlay}
              />
              <View style={styles.bannerContent}>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW ARRIVAL</Text>
                </View>
                <Text style={styles.bannerTitle}>ของสะสมสุดพิเศษ!</Text>
                <Text style={styles.bannerSubtitle}>คอลเลกชันใหม่ล่าสุดจาก MITH</Text>
              </View>
            </View>
            
            <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>สินค้าแนะนำสำหรับคุณ</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
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
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'transparent',
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  shopName: {
    fontSize: 32,
    fontFamily: 'Kanit_700Bold',
    marginTop: 4,
  },
  bannerContainer: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  bannerVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  newBadge: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Kanit_700Bold',
    letterSpacing: 1,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'Kanit_700Bold',
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'Kanit_400Regular',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 16,
    fontFamily: 'Kanit_700Bold',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
});
