import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../src/services/supabase';
import { useThemeStore } from '../src/store/useThemeStore';

export default function OrdersScreen() {
  const { theme } = useThemeStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_purchase,
            products (name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error.message);
      Alert.alert('ผิดพลาด', 'ไม่สามารถโหลดประวัติการสั่งซื้อได้ครับ');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA000';
      case 'processing': return '#2196F3';
      case 'shipped': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#666';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={[styles.orderCard, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
      <View style={[styles.orderHeader, { borderBottomColor: Colors[theme].divider }]}>
        <Text style={[styles.orderDate, { color: Colors[theme].subtext }]}>
          {new Date(item.created_at).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.itemsList}>
        {item.order_items.map((oi: any, index: number) => (
          <Text key={index} style={[styles.itemText, { color: Colors[theme].text }]} numberOfLines={1}>
            • {oi.products?.name} x {oi.quantity}
          </Text>
        ))}
      </View>

      <View style={[styles.orderFooter, { borderTopColor: Colors[theme].divider }]}>
        <Text style={[styles.totalLabel, { color: Colors[theme].subtext }]}>ยอดรวมทั้งหมด</Text>
        <Text style={[styles.totalValue, { color: Colors[theme].tint }]}>{item.total_amount.toLocaleString()} ฿</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors[theme].background }]}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <Stack.Screen options={{ 
        title: 'ประวัติการสั่งซื้อ', 
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: Colors[theme].background },
        headerTintColor: Colors[theme].text,
        headerShadowVisible: false,
      }} />
      {orders.length === 0 ? (
        <View style={[styles.centered, { backgroundColor: Colors[theme].background }]}>
          <Ionicons name="receipt-outline" size={60} color={Colors[theme].subtext} />
          <Text style={[styles.emptyText, { color: Colors[theme].subtext }]}>ยังไม่มีประวัติการสั่งซื้อครับ</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchOrders}
          refreshing={loading}
        />
      )}
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
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    fontFamily: 'Kanit_400Regular',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Kanit_700Bold',
  },
  itemsList: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Kanit_400Regular',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Kanit_400Regular',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Kanit_700Bold',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
});
