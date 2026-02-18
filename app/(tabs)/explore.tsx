import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeStore } from '../../src/store/useThemeStore';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'เสื้อผ้า (Apparel)', icon: 'shirt-outline', color: 'rgba(233, 30, 99, 0.1)' },
  { id: '2', name: 'สติกเกอร์ (Stickers)', icon: 'copy-outline', color: 'rgba(33, 150, 243, 0.1)' },
  { id: '3', name: 'ของสะสม (Collectibles)', icon: 'diamond-outline', color: 'rgba(156, 39, 176, 0.1)' },
  { id: '4', name: 'เครื่องประดับ (Accs)', icon: 'watch-outline', color: 'rgba(76, 175, 80, 0.1)' },
  { id: '5', name: 'ทั้งหมด (All Items)', icon: 'apps-outline', color: 'rgba(255, 152, 0, 0.1)' },
];

const TRENDING_KEYWORDS = ['MITH', 'Sticker', 'Limited', 'สติกเกอร์', 'เสื้อ'];

export default function ExploreScreen() {
  const { theme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();


  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <Stack.Screen options={{ title: 'ค้นหา', headerTitleAlign: 'center' }} />
      
      {/* Search Bar */}
      <View style={[styles.searchHeader, { backgroundColor: Colors[theme].background, borderBottomColor: Colors[theme].divider }]}>
        <View style={[styles.searchBar, { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
          <Ionicons name="search" size={20} color={Colors[theme].subtext} />
          <TextInput
            style={[styles.input, { color: Colors[theme].text }]}
            placeholder="ค้นหาสินค้าที่ต้องการ..."
            placeholderTextColor={Colors[theme].subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors[theme].subtext} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Trending Keywords */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>คำค้นหายอดนิยม</Text>
          </View>
          <View style={styles.keywordContainer}>
            {TRENDING_KEYWORDS.map((word, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.keywordBadge, 
                  { 
                    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F5F5F5',
                    borderColor: Colors[theme].divider
                  }
                ]} 
                onPress={() => setSearchQuery(word)}
              >
                <Text style={[styles.keywordText, { color: Colors[theme].subtext }]}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>หมวดหมู่สินค้า</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>ดูทั้งหมด</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={CATEGORIES}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.categoryCard} 
                onPress={() => alert(`คัดกรองหมวดหมู่ ${item.name} ครับ`)}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={28} color={Colors[theme].tint} />
                </View>
                <Text style={[styles.categoryName, { color: Colors[theme].text }]} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            )}
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
  },
  searchHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
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
    fontFamily: 'Kanit_700Bold',
  },
  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  keywordBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  keywordText: {
    fontSize: 14,
    fontFamily: 'Kanit_400Regular',
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
    textAlign: 'center',
    fontFamily: 'Kanit_500Medium',
  },
  seeAll: {
    color: '#FF4081',
    fontFamily: 'Kanit_700Bold',
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
    fontSize: 22,
    marginBottom: 8,
    fontFamily: 'Kanit_700Bold',
  },
  promoSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 15,
    fontFamily: 'Kanit_400Regular',
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
    fontSize: 12,
    fontFamily: 'Kanit_700Bold',
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
