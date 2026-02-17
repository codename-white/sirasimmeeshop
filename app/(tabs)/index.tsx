import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '../../src/components/products/ProductCard';
import { supabase } from '../../src/services/supabase';
import { Product } from '../../src/types';

const { width } = Dimensions.get('window');

const bannerVideoSource = 'https://lsctinvlisgyasqgmivm.supabase.co/storage/v1/object/sign/shop/gapbo.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOGE3NWJjNS0wNjdjLTRjM2MtYTNhOC0zZGI3OGY2YjNlYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaG9wL2dhcGJvLm1wNCIsImlhdCI6MTc3MTMxNDYxOSwiZXhwIjoxODAyODUwNjE5fQ.FShkNYrdy60smeArEgRzgYLvJctfULQWBQFxlZQBHdM';

export default function HomeScreen() {
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.welcomeText}>ยินดีต้อนรับสู่</Text>
            <Text style={styles.brandText}>Shopsirasimmee 🍿</Text>
            
            <View style={styles.bannerContainer}>
              <VideoView
                player={player}
                style={styles.bannerVideo}
                nativeControls={false}
                contentFit="cover"
              />
              <View style={styles.bannerOverlay} />
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>ของสะสมสุดพิเศษ!</Text>
                <Text style={styles.bannerSubtitle}>คอลเลกชันใหม่ล่าสุดจาก MITH</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>สินค้าแนะนำสำหรับคุณ</Text>
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
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  bannerContainer: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  bannerVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
});
