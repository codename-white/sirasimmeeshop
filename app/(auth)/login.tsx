import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Link, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/services/supabase';

const { width, height } = Dimensions.get('window');

const videoSource = 'https://lsctinvlisgyasqgmivm.supabase.co/storage/v1/object/sign/shop/gapbo.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOGE3NWJjNS0wNjdjLTRjM2MtYTNhOC0zZGI3OGY2YjNlYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaG9wL2dhcGJvLm1wNCIsImlhdCI6MTc3MTMxNDYxOSwiZXhwIjoxODAyODUwNjE5fQ.FShkNYrdy60smeArEgRzgYLvJctfULQWBQFxlZQBHdM';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
    player.muted = true;
  });

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('ผิดพลาด', 'กรุณากรอกอีเมลและรหัสผ่านครับ');
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
      setLoading(false);
    } else {
      router.replace('/(tabs)');
    }
  }

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <VideoView
        player={player}
        style={styles.backgroundVideo}
        nativeControls={false}
        contentFit="cover"
      />
      
      {/* Dark Overlay to help contrast */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <BlurView intensity={20} tint="dark" style={styles.glassContainer}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="flash" size={40} color="#E91E63" />
            </View>
            <Text style={styles.title}>Shopsirasimmee</Text>
            <Text style={styles.subtitle}>MADE IN THAILAND 🇹🇭</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.6)" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="อีเมล"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="รหัสผ่าน"
                placeholderTextColor="rgba(255,255,255,0.4)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={signInWithEmail}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>ยังไม่มีบัญชีใช่ไหม? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>สมัครสมาชิก</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', // Slightly dark overlay for better text readability
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  glassContainer: {
    borderRadius: 30,
    padding: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.3)',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    height: 60,
    borderRadius: 15,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#E91E63',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
  },
});
