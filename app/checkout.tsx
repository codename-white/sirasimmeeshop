import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useCartStore } from '../src/store/useCartStore';
import { supabase } from '../src/services/supabase';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('ผิดพลาด', 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อครับ');
      return;
    }

    try {
      setLoading(true);

      // 1. Create the Order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create the Order Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Success!
      Alert.alert('สำเร็จ!', 'การสั่งซื้อของคุณเสร็จสมบูรณ์แล้วครับ ป๊อบคอร์นกำลังจัดเตรียมข้อมูลให้ครับ', [
        {
          text: 'ตกลง',
          onPress: () => {
            clearCart();
            router.replace('/(tabs)/profile');
          }
        }
      ]);
    } catch (error: any) {
      console.error('Checkout error:', error);
      Alert.alert('ผิดพลาด', 'ไม่สามารถสร้างคำสั่งซื้อได้: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'ยืนยันการสั่งซื้อ', headerTitleAlign: 'center' }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>รายการสินค้า</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name} x {item.quantity}</Text>
              <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()} ฿</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ที่อยู่จัดส่ง</Text>
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.addressText}>{user?.email || 'กำลังโหลดข้อมูล...'}</Text>
          </View>
          <Text style={styles.addressNote}>* ปล. ระบบจะใช้ที่อยู่เริ่มต้นที่ตั้งค่าไว้ในโปรไฟล์ครับ</Text>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ยอดรวมสินค้า</Text>
            <Text style={styles.summaryValue}>{totalPrice().toLocaleString()} ฿</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ค่าจัดส่ง</Text>
            <Text style={styles.summaryValue}>ฟรี</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>ยอดชำระสุทธิ</Text>
            <Text style={styles.totalValue}>{totalPrice().toLocaleString()} ฿</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.confirmButton, loading && styles.buttonDisabled]} 
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>ยืนยันการสั่งซื้อ</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  addressText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  addressNote: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  totalRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E91E63',
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
  confirmButton: {
    backgroundColor: '#E91E63',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
