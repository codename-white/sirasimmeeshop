import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../../src/services/supabase';
import { useRouter, Link } from 'expo-router';

export default function RegisterScreen() {
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>สร้างบัญชีใหม่</Text>
        <Text style={styles.subtitle}>เข้าร่วม Shopsirasimmee กับเรา</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>อีเมล</Text>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>รหัสผ่าน</Text>
        <TextInput
          style={styles.input}
          placeholder="อย่างน้อย 6 ตัวอักษร"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>ยืนยันรหัสผ่าน</Text>
        <TextInput
          style={styles.input}
          placeholder="พิมพ์รหัสผ่านอีกครั้ง"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
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
          <Text style={styles.footerText}>มีบัญชีอยู่แล้ว? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>เข้าสู่ระบบ</Text>
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
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#E91E63',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    elevation: 4,
    shadowColor: '#E91E63',
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
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
  },
});
