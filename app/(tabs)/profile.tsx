import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Session } from '@supabase/supabase-js';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/services/supabase';
import { useThemeStore } from '../../src/store/useThemeStore';

export default function ProfileScreen() {
  const { theme, toggleTheme } = useThemeStore();
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

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const openSocialLink = async (url: string) => {
    try {
      if (url.includes('instagram.com')) {
        // Extract username correctly even with query parameters
        const pathPart = url.split('instagram.com/')[1] || '';
        const username = pathPart.split('?')[0];
        
        if (username) {
          const appUrl = `instagram://user?username=${username}`;
          const supported = await Linking.canOpenURL(appUrl);
          if (supported) {
            await Linking.openURL(appUrl);
            return;
          }
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
      style={[styles.container, { backgroundColor: Colors[theme].background }]} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={[styles.header, { backgroundColor: Colors[theme].background }]}>
        <View style={[styles.headerBg, { backgroundColor: theme === 'dark' ? '#121212' : '#F8F9FA' }]} />
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
          <Text style={[styles.userName, { color: Colors[theme].text }]}>{fullName}</Text>
          <Text style={[styles.userEmail, { color: Colors[theme].subtext }]}>{userEmail}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        {loading && !profile && <ActivityIndicator color={Colors[theme].tint} style={{ marginBottom: 20 }} />}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].subtext }]}>การจัดการบัญชี</Text>
          <View style={[styles.menuCard, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: Colors[theme].divider }]} 
              onPress={() => router.push('/edit-profile')} 
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: theme === 'dark' ? 'rgba(33, 150, 243, 0.1)' : '#E3F2FD' }]}>
                <Ionicons name="person-outline" size={22} color="#2196F3" />
              </View>
              <Text style={[styles.menuText, { color: Colors[theme].text }]}>แก้ไขข้อมูลส่วนตัว</Text>
              <Ionicons name="chevron-forward" size={18} color={theme === 'dark' ? '#555' : '#CCC'} />
            </TouchableOpacity>
 
            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: Colors[theme].divider }]} 
              onPress={() => alert('กําลังพัฒนาครับ Maker!')} 
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: theme === 'dark' ? 'rgba(76, 175, 80, 0.1)' : '#E8F5E9' }]}>
                <Ionicons name="location-outline" size={22} color="#4CAF50" />
              </View>
              <Text style={[styles.menuText, { color: Colors[theme].text }]}>ที่อยู่สำหรับการจัดส่ง</Text>
              <Ionicons name="chevron-forward" size={18} color={theme === 'dark' ? '#555' : '#CCC'} />
            </TouchableOpacity>
 
            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => router.push('/orders')} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: theme === 'dark' ? 'rgba(255, 152, 0, 0.1)' : '#FFF3E0' }]}>
                <Ionicons name="receipt-outline" size={22} color="#FF9800" />
              </View>
              <Text style={[styles.menuText, { color: Colors[theme].text }]}>ประวัติการสั่งซื้อ</Text>
              <Ionicons name="chevron-forward" size={18} color={theme === 'dark' ? '#555' : '#CCC'} />
            </TouchableOpacity>
          </View>
        </View>
 
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].subtext }]}>การตั้งค่า</Text>
          <View style={[styles.menuCard, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
            <View style={[styles.menuItem, { borderBottomColor: Colors[theme].divider }]}>
              <View style={[styles.menuIcon, { backgroundColor: theme === 'dark' ? 'rgba(63, 81, 181, 0.1)' : '#E8EAF6' }]}>
                <Ionicons name={theme === 'dark' ? "moon" : "sunny"} size={22} color="#3F51B5" />
              </View>
              <Text style={[styles.menuText, { color: Colors[theme].text }]}>Dark Mode</Text>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: Colors[theme].tint }}
                thumbColor="#fff"
              />
            </View>
 
            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: Colors[theme].divider }]} 
              onPress={() => alert('Shopsirasimmee v1.0.0')} 
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: theme === 'dark' ? 'rgba(156, 39, 176, 0.1)' : '#F3E5F5' }]}>
                <Ionicons name="information-circle-outline" size={22} color="#9C27B0" />
              </View>
              <Text style={[styles.menuText, { color: Colors[theme].text }]}>เกี่ยวกับแอป</Text>
              <Ionicons name="chevron-forward" size={18} color={theme === 'dark' ? '#555' : '#CCC'} />
            </TouchableOpacity>
 
            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: theme === 'dark' ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE' }]}>
                <Ionicons name="log-out-outline" size={22} color="#F44336" />
              </View>
              <Text style={[styles.menuText, { color: '#F44336', fontFamily: 'Kanit_700Bold' }]}>ออกจากระบบ</Text>
            </TouchableOpacity>
          </View>
        </View>
 
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].subtext }]}>ติดตามแก๊ปโบ้</Text>
          <View style={[styles.socialCard, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => openSocialLink('https://www.facebook.com/gapbogapbo')}>
              <View style={[styles.socialIconBox, { backgroundColor: '#1877F2' }]}>
                <Ionicons name="logo-facebook" size={24} color="#fff" />
              </View>
              <Text style={[styles.socialLabel, { color: Colors[theme].subtext }]}>Facebook</Text>
            </TouchableOpacity>
 
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://www.instagram.com/gapbo/')}>
              <View style={[styles.socialIconBox, { backgroundColor: '#E4405F' }]}>
                <Ionicons name="logo-instagram" size={24} color="#fff" />
              </View>
              <Text style={[styles.socialLabel, { color: Colors[theme].subtext }]}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} onPress={() => openSocialLink('https://www.youtube.com/gapbo')}>
              <View style={[styles.socialIconBox, { backgroundColor: '#FF0000' }]}>
                <Ionicons name="logo-youtube" size={24} color="#fff" />
              </View>
              <Text style={[styles.socialLabel, { color: Colors[theme].subtext }]}>YouTube</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} onPress={() => openSocialLink('https://www.tiktok.com/@sirasimmee')}>
              <View style={[styles.socialIconBox, { backgroundColor: '#000000' }]}>
                <Ionicons name="logo-tiktok" size={24} color="#fff" />
              </View>
              <Text style={[styles.socialLabel, { color: Colors[theme].subtext }]}>TikTok</Text>
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
  },
  header: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 140,
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
    marginBottom: 4,
    fontFamily: 'Kanit_700Bold',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Kanit_400Regular',
  },
  mainContent: {
    padding: 20,
    marginTop: -20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    paddingTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 5,
    letterSpacing: 1,
    fontFamily: 'Kanit_700Bold',
  },
  menuCard: {
    borderRadius: 20,
    paddingVertical: 5,
    borderWidth: 1,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
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
    fontWeight: '500',
    fontFamily: 'Kanit_400Regular',
  },
  socialCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
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
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  socialLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'Kanit_700Bold',
  },
});
