import { Colors } from '@/constants/theme';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/services/supabase';
import { useThemeStore } from '../../src/store/useThemeStore';

export default function RegisterScreen() {
  const { theme } = useThemeStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    if (!email || !password || !confirmPassword) {
      Alert.alert('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบครับ');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('ผิดพลาด', 'รหัสผ่านไม่ตรงกันครับ');
      return;
    }

    setLoading(true);
    const { 
      data: { session },
      error 
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    } else {
      if (!session) {
        Alert.alert('สำเร็จ', 'โปรดตรวจสอบอีเมลของคุณเพื่อยืนยันตัวตนครับ');
        router.replace('/(auth)/login');
      } else {
        router.replace('/(tabs)');
      }
    }
    setLoading(false);
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[theme].text }]}>สร้างบัญชีใหม่</Text>
        <Text style={[styles.subtitle, { color: Colors[theme].subtext }]}>เข้าร่วม Shopsirasimmee กับเรา</Text>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: Colors[theme].text }]}>อีเมล</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#f5f5f5', color: Colors[theme].text, borderColor: Colors[theme].divider, borderWidth: 1 }]}
          placeholder="example@email.com"
          placeholderTextColor={Colors[theme].subtext}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { color: Colors[theme].text }]}>รหัสผ่าน</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#f5f5f5', color: Colors[theme].text, borderColor: Colors[theme].divider, borderWidth: 1 }]}
          placeholder="อย่างน้อย 6 ตัวอักษร"
          placeholderTextColor={Colors[theme].subtext}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={[styles.label, { color: Colors[theme].text }]}>ยืนยันรหัสผ่าน</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#f5f5f5', color: Colors[theme].text, borderColor: Colors[theme].divider, borderWidth: 1 }]}
          placeholder="พิมพ์รหัสผ่านอีกครั้ง"
          placeholderTextColor={Colors[theme].subtext}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled, { backgroundColor: Colors[theme].tint, shadowColor: Colors[theme].tint }]} 
          onPress={signUpWithEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>สมัครสมาชิก</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: Colors[theme].subtext }]}>มีบัญชีอยู่แล้ว? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={[styles.linkText, { color: Colors[theme].tint }]}>เข้าสู่ระบบ</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    fontFamily: 'Kanit_700Bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
    fontFamily: 'Kanit_700Bold',
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Kanit_700Bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Kanit_400Regular',
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Kanit_700Bold',
  },
});
