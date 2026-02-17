import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useCartStore } from '../../src/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const router = useRouter();

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <AutoSlidingImage images={item.images} defaultImage={item.image_url} />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity 
            onPress={() => removeItem(item.id)} 
            style={styles.miniRemoveBtn}
            activeOpacity={0.6}
          >
            <Ionicons name="close-circle" size={20} color="#DDD" />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemCategory}>{item.category || 'Limited Edition'}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()} ฿</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            style={styles.quantityBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={16} color="#333" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            style={styles.quantityBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color="#E91E63" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="bag-handle-outline" size={60} color="#E91E63" />
        </View>
        <Text style={styles.emptyTitle}>Your collection is empty</Text>
        <Text style={styles.emptySubtitle}>Start adding pieces to your gallery.</Text>
        <TouchableOpacity 
          style={styles.continueBtn} 
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Go Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.activeStepCircle]}>
            <Text style={styles.activeStepText}>1</Text>
          </View>
          <Text style={styles.stepLabel}>Cart</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.step}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Details</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.step}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepText}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Pay</Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>รวมราคาที่ต้องชำระ</Text>
          <Text style={styles.totalAmount}>{totalPrice().toLocaleString()} ฿</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutBtn} 
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
    backgroundColor: '#fff',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  step: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStepCircle: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  stepText: {
    fontSize: 12,
    color: '#999',
  },
  activeStepText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  stepLine: {
    width: 40,
    height: 1,
    backgroundColor: '#EEE',
    marginHorizontal: 10,
    marginTop: -15,
  },
  listContent: {
    padding: 20,
    paddingBottom: 180,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
    borderColor: '#F8F8F8',
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
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  itemCategory: {
    fontSize: 12,
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    alignSelf: 'flex-start',
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  miniRemoveBtn: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FDF0F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  continueBtn: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
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
    color: '#999',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  checkoutBtn: {
    backgroundColor: '#E91E63',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
