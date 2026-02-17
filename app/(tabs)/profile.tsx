import { Ionicons } from '@expo/vector-icons';
import { Session } from '@supabase/supabase-js';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/services/supabase';

export default function ProfileScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  async function fetchData() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setProfile(data[0]);
        } else {
          setProfile(null);
        }
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('ผิดพลาด', error.message);
    } else {
      router.replace('/(auth)/login');
    }
  }

  const openSocialLink = async (url: string) => {
    try {
      if (url.includes('instagram.com')) {
        const username = url.split('/').pop();
        const appUrl = `instagram://user?username=${username}`;
        const supported = await Linking.canOpenURL(appUrl);
        if (supported) {
          await Linking.openURL(appUrl);
          return;
        }
      }
      await Linking.openURL(url);
    } catch (err) {
      console.error("Couldn't load page", err);
      Alert.alert('ผิดพลาด', 'ไม่สามารถเปิดลิงก์ได้ครับ');
    }
  };

  const userEmail = session?.user?.email || 'N/A';
  const fullName = profile?.full_name || 'Maker No.1';
  const avatarUrl = profile?.avatar_url;

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <View style={styles.profileInfo}>
          <TouchableOpacity 
            style={styles.avatarWrapper} 
            activeOpacity={0.8}
            onPress={() => router.push('/edit-profile')}
          >
            <View style={styles.avatarBorder}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={50} color="#fff" />
              )}
            </View>
            <View style={styles.miniEditBadge}>
              <Ionicons name="pencil" size={12} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        {loading && !profile && <ActivityIndicator color="#E91E63" style={{ marginBottom: 20 }} />}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>การจัดการบัญชี</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => router.push('/edit-profile')} 
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="person-outline" size={22} color="#2196F3" />
              </View>
              <Text style={styles.menuText}>แก้ไขข้อมูลส่วนตัว</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => alert('กําลังพัฒนาครับ Maker!')} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="location-outline" size={22} color="#4CAF50" />
              </View>
              <Text style={styles.menuText}>ที่อยู่สำหรับการจัดส่ง</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => router.push('/orders')} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="receipt-outline" size={22} color="#FF9800" />
              </View>
              <Text style={styles.menuText}>ประวัติการสั่งซื้อ</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ติดตามแก๊ปโบ้</Text>
          <View style={styles.socialCard}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => openSocialLink('https://www.facebook.com/gapbogapbo')}>
              <View style={[styles.socialIconBox, { backgroundColor: '#1877F2' }]}>
                <Ionicons name="logo-facebook" size={24} color="#fff" />
              </View>
              <Text style={styles.socialLabel}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} onPress={() => openSocialLink('https://www.instagram.com/gapbo')}>
              <View style={[styles.socialIconBox, { backgroundColor: '#E4405F' }]}>
                <Ionicons name="logo-instagram" size={24} color="#fff" />
              </View>
              <Text style={styles.socialLabel}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} onPress={() => openSocialLink('https://www.youtube.com/gapbo')}>
              <View style={[styles.socialIconBox, { backgroundColor: '#FF0000' }]}>
                <Ionicons name="logo-youtube" size={24} color="#fff" />
              </View>
              <Text style={styles.socialLabel}>YouTube</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} onPress={() => openSocialLink('https://www.tiktok.com/@sirasimmee')}>
              <View style={[styles.socialIconBox, { backgroundColor: '#000000' }]}>
                <Ionicons name="logo-tiktok" size={24} color="#fff" />
              </View>
              <Text style={styles.socialLabel}>TikTok</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>การตั้งค่า</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={() => alert('Shopsirasimmee v1.0.0')} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="information-circle-outline" size={22} color="#9C27B0" />
              </View>
              <Text style={styles.menuText}>เกี่ยวกับแอป</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="log-out-outline" size={22} color="#F44336" />
              </View>
              <Text style={[styles.menuText, { color: '#F44336', fontWeight: 'bold' }]}>ออกจากระบบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 250,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 140,
    backgroundColor: '#E91E63',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarWrapper: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 60,
    marginBottom: 10,
    position: 'relative',
  },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  miniEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
  },
  mainContent: {
    padding: 20,
    marginTop: -20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#AAA',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 5,
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 5,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  socialCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  socialBtn: {
    alignItems: 'center',
    flex: 1,
  },
  socialIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  socialLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
