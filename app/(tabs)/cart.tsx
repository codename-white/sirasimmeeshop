import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCartStore } from '../../src/store/useCartStore';
import { useThemeStore } from '../../src/store/useThemeStore';

const { width } = Dimensions.get('window');

// Auto-sliding image component for each cart item
const AutoSlidingImage = ({ images, defaultImage }: { images?: string[], defaultImage: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayImages = images && images.length > 1 ? images : [defaultImage];

  useEffect(() => {
    if (displayImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [displayImages]);

  return (
    <Image 
      source={{ uri: displayImages[currentIndex] }} 
      style={styles.itemImage} 
      contentFit="cover" 
      transition={500}
    />
  );
};

export default function CartScreen() {
  const { theme } = useThemeStore();
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const router = useRouter();

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={[styles.cartItem, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
      <AutoSlidingImage images={item.images} defaultImage={item.image_url} />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemName, { color: Colors[theme].text }]} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity 
            onPress={() => removeItem(item.id)} 
            style={styles.miniRemoveBtn}
            activeOpacity={0.6}
          >
            <Ionicons name="close-circle" size={20} color={theme === 'dark' ? '#DDD' : '#999'} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.itemCategory, { color: Colors[theme].subtext }]}>{item.category || 'Limited Edition'}</Text>
        <Text style={[styles.itemPrice, { color: Colors[theme].tint }]}>{item.price.toLocaleString()} ฿</Text>
        
        <View style={[styles.quantityContainer, { backgroundColor: theme === 'dark' ? '#2A2A2A' : '#F5F5F5' }]}>
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            style={[styles.quantityBtn, { backgroundColor: Colors[theme].background }]}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={16} color={Colors[theme].text} />
          </TouchableOpacity>
          <Text style={[styles.quantityText, { color: Colors[theme].text }]}>{item.quantity}</Text>
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            style={[styles.quantityBtn, { backgroundColor: Colors[theme].background }]}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={Colors[theme].tint} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: Colors[theme].background }]}>
        <View style={[styles.emptyIconCircle, { backgroundColor: `${Colors[theme].tint}1A` }]}>
          <Ionicons name="bag-handle-outline" size={60} color={Colors[theme].tint} />
        </View>
        <Text style={[styles.emptyTitle, { color: Colors[theme].text }]}>Your collection is empty</Text>
        <Text style={[styles.emptySubtitle, { color: Colors[theme].subtext }]}>Start adding pieces to your gallery.</Text>
        <TouchableOpacity 
          style={[styles.continueBtn, { backgroundColor: Colors[theme].tint }]} 
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Go Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      {/* Progress Stepper */}
      <View style={[styles.stepperContainer, { backgroundColor: Colors[theme].background, borderBottomColor: Colors[theme].divider }]}>
        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.activeStepCircle, { backgroundColor: Colors[theme].tint, borderColor: Colors[theme].tint }]}>
            <Text style={styles.activeStepText}>1</Text>
          </View>
          <Text style={[styles.stepLabel, { color: Colors[theme].subtext }]}>Cart</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: Colors[theme].divider }]} />
        <View style={styles.step}>
          <View style={[styles.stepCircle, { borderColor: Colors[theme].divider }]}>
            <Text style={[styles.stepText, { color: Colors[theme].subtext }]}>2</Text>
          </View>
          <Text style={[styles.stepLabel, { color: Colors[theme].subtext }]}>Details</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: Colors[theme].divider }]} />
        <View style={styles.step}>
          <View style={[styles.stepCircle, { borderColor: Colors[theme].divider }]}>
            <Text style={[styles.stepText, { color: Colors[theme].subtext }]}>3</Text>
          </View>
          <Text style={[styles.stepLabel, { color: Colors[theme].subtext }]}>Pay</Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={[styles.footer, { backgroundColor: Colors[theme].card }]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: Colors[theme].subtext }]}>รวมราคาที่ต้องชำระ</Text>
          <Text style={[styles.totalAmount, { color: Colors[theme].text }]}>{totalPrice().toLocaleString()} ฿</Text>
        </View>
        <TouchableOpacity 
          style={[styles.checkoutBtn, { backgroundColor: Colors[theme].tint, shadowColor: Colors[theme].tint }]} 
          onPress={() => router.push('/checkout')}
          activeOpacity={0.9}
        >
          <Text style={styles.checkoutText}>ดำเนินการชำระเงิน</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  step: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStepCircle: {
  },
  stepText: {
    fontSize: 12,
  },
  activeStepText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Kanit_700Bold',
  },
  stepLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontFamily: 'Kanit_700Bold',
  },
  stepLine: {
    width: 40,
    height: 1,
    marginHorizontal: 10,
    marginTop: -15,
  },
  listContent: {
    padding: 20,
    paddingBottom: 180,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    // Elegant Boutique Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
  },
  itemImage: {
    width: 100,
    height: 120,
    borderRadius: 15,
    backgroundColor: '#F9F9F9',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 18,
    flex: 1,
    fontFamily: 'Kanit_700Bold',
  },
  itemCategory: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 18,
    marginVertical: 8,
    fontFamily: 'Kanit_700Bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 4,
    alignSelf: 'flex-start',
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: 'Kanit_700Bold',
  },
  miniRemoveBtn: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 22,
    marginBottom: 10,
    fontFamily: 'Kanit_700Bold',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: 'Kanit_400Regular',
  },
  continueBtn: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: 'Kanit_700Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -15 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 25,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  totalAmount: {
    fontSize: 26,
    fontFamily: 'Kanit_700Bold',
  },
  checkoutBtn: {
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: 'Kanit_700Bold',
  },
});
