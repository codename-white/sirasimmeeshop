import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../src/services/supabase';
import { useCartStore } from '../src/store/useCartStore';
import { useThemeStore } from '../src/store/useThemeStore';

export default function CheckoutScreen() {
  const { theme } = useThemeStore();
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

    if (items.length === 0) {
      Alert.alert('ผิดพลาด', 'ไม่พบสินค้าในตะกร้าครับ');
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
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <Stack.Screen options={{ 
        title: 'ยืนยันการสั่งซื้อ', 
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: Colors[theme].background },
        headerTintColor: Colors[theme].text,
        headerShadowVisible: false,
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>รายการสินค้า</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={[styles.itemName, { color: Colors[theme].text }]}>{item.name} x {item.quantity}</Text>
              <Text style={[styles.itemPrice, { color: Colors[theme].text }]}>{(item.price * item.quantity).toLocaleString()} ฿</Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>ที่อยู่จัดส่ง</Text>
          <View style={[styles.addressBox, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F5F5F5' }]}>
            <Ionicons name="location-outline" size={20} color={Colors[theme].subtext} />
            <Text style={[styles.addressText, { color: Colors[theme].text }]}>{user?.email || 'กำลังโหลดข้อมูล...'}</Text>
          </View>
          <Text style={[styles.addressNote, { color: Colors[theme].subtext }]}>* ปล. ระบบจะใช้ที่อยู่เริ่มต้นที่ตั้งค่าไว้ในโปรไฟล์ครับ</Text>
        </View>

        <View style={[styles.summarySection, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: Colors[theme].subtext }]}>ยอดรวมสินค้า</Text>
            <Text style={[styles.summaryValue, { color: Colors[theme].text }]}>{totalPrice().toLocaleString()} ฿</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: Colors[theme].subtext }]}>ค่าจัดส่ง</Text>
            <Text style={[styles.summaryValue, { color: Colors[theme].text }]}>ฟรี</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: Colors[theme].divider }]}>
            <Text style={[styles.totalLabel, { color: Colors[theme].text }]}>ยอดชำระสุทธิ</Text>
            <Text style={[styles.totalValue, { color: Colors[theme].tint }]}>{totalPrice().toLocaleString()} ฿</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: Colors[theme].card, borderTopColor: Colors[theme].divider }]}>
        <TouchableOpacity 
          style={[styles.confirmButton, loading && styles.buttonDisabled, { backgroundColor: Colors[theme].tint }]} 
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'Kanit_700Bold',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'Kanit_400Regular',
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'Kanit_700Bold',
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  addressText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Kanit_400Regular',
  },
  addressNote: {
    marginTop: 8,
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: 'Kanit_400Regular',
  },
  summarySection: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Kanit_700Bold',
  },
  totalRow: {
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Kanit_700Bold',
  },
  totalValue: {
    fontSize: 22,
    fontFamily: 'Kanit_700Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
  confirmButton: {
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
    fontFamily: 'Kanit_700Bold',
  },
});
