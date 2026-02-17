import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'เสื้อผ้า (Apparel)', icon: 'shirt-outline', color: '#FFEBEE' },
  { id: '2', name: 'สติกเกอร์ (Stickers)', icon: 'copy-outline', color: '#E3F2FD' },
  { id: '3', name: 'ของสะสม (Collectibles)', icon: 'diamond-outline', color: '#F3E5F5' },
  { id: '4', name: 'เครื่องประดับ (Accs)', icon: 'watch-outline', color: '#E8F5E9' },
  { id: '5', name: 'ทั้งหมด (All Items)', icon: 'apps-outline', color: '#FFF3E0' },
];

const TRENDING_KEYWORDS = ['MITH', 'Sticker', 'Limited', 'สติกเกอร์', 'เสื้อ'];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity 
      style={styles.categoryCard} 
      onPress={() => alert(`คัดกรองหมวดหมู่ ${item.name} ครับ`)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={28} color="#333" />
      </View>
      <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'ค้นหา', headerTitleAlign: 'center' }} />
      
      {/* Search Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="ค้นหาสินค้าที่ต้องการ..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Trending Keywords */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>คำค้นหายอดนิยม</Text>
          <View style={styles.keywordContainer}>
            {TRENDING_KEYWORDS.map((word, index) => (
              <TouchableOpacity key={index} style={styles.keywordBadge} onPress={() => setSearchQuery(word)}>
                <Text style={styles.keywordText}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>หมวดหมู่สินค้า</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>ดูทั้งหมด</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.categoryRow}
          />
        </View>

        {/* Promotion Banner Placeholder */}
        <TouchableOpacity style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>New Collection 2026</Text>
            <Text style={styles.promoSubtitle}>สติกเกอร์ MITH รุ่นใหม่ล่าสุด พร้อมวางจำหน่ายแล้วที่นี่!</Text>
            <View style={styles.shopNowBtn}>
              <Text style={styles.shopNowText}>เลือกซื้อเลย</Text>
            </View>
          </View>
          <View style={styles.promoIcon}>
            <Ionicons name="rocket-outline" size={80} color="rgba(255,255,255,0.3)" />
          </View>
        </TouchableOpacity>

        <View style={styles.footerSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  keywordBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  keywordText: {
    fontSize: 14,
    color: '#666',
  },
  categoryRow: {
    justifyContent: 'flex-start',
    gap: 10,
  },
  categoryCard: {
    width: (width - 60) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  seeAll: {
    color: '#E91E63',
    fontWeight: '600',
  },
  promoBanner: {
    backgroundColor: '#E91E63',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: 10,
  },
  promoContent: {
    flex: 1,
    zIndex: 1,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promoSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 15,
  },
  shopNowBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  shopNowText: {
    color: '#E91E63',
    fontWeight: 'bold',
    fontSize: 12,
  },
  promoIcon: {
    position: 'absolute',
    right: -20,
    bottom: -10,
  },
  footerSpacing: {
    height: 50,
  },
});
