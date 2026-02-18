import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../src/services/supabase';
import { useThemeStore } from '../src/store/useThemeStore';

export default function EditProfileScreen() {
  const { theme } = useThemeStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/(auth)/login');
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const profileData = data[0];
        setFullName(profileData.full_name || '');
        setPhone(profileData.phone || '');
        setAddress(profileData.address || '');
        setAvatarUrl(profileData.avatar_url || null);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = uri.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (error: any) {
      console.error('Upload error:', error.message);
      Alert.alert('ผิดพลาด', 'ไม่สามารถอัปโหลดรูปภาพได้ครับ');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates = {
        id: user.id,
        full_name: fullName,
        phone: phone,
        address: address,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      Alert.alert('สำเร็จ', 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้วครับ', [
        { text: 'ตกลง', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Update profile error:', error.message);
      Alert.alert('ผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors[theme].background }]}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: Colors[theme].background }]}
    >
      <Stack.Screen options={{ 
        title: 'แก้ไขโปรไฟล์', 
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors[theme].background },
        headerTintColor: Colors[theme].text,
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={[styles.avatarContainer, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]} disabled={saving}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color={Colors[theme].subtext} />
              </View>
            )}
            <View style={[styles.editBadge, { backgroundColor: Colors[theme].tint }]}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.avatarHint, { color: Colors[theme].subtext }]}>แตะเพื่อเปลี่ยนรูปโปรไฟล์</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: Colors[theme].subtext }]}>ชื่อ-นามสกุล</Text>
            <View style={[styles.inputWrapper, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
              <Ionicons name="person-outline" size={20} color={Colors[theme].subtext} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: Colors[theme].text }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="ชื่อของคุณ"
                placeholderTextColor={Colors[theme].subtext}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: Colors[theme].subtext }]}>เบอร์โทรศัพท์</Text>
            <View style={[styles.inputWrapper, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
              <Ionicons name="call-outline" size={20} color={Colors[theme].subtext} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: Colors[theme].text }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="0xx-xxx-xxxx"
                placeholderTextColor={Colors[theme].subtext}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: Colors[theme].subtext }]}>ที่อยู่จัดส่ง</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].divider }]}>
              <Ionicons name="location-outline" size={20} color={Colors[theme].subtext} style={[styles.inputIcon, { marginTop: 12 }]} />
              <TextInput
                style={[styles.input, styles.textArea, { color: Colors[theme].text }]}
                value={address}
                onChangeText={setAddress}
                placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล..."
                placeholderTextColor={Colors[theme].subtext}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, saving && styles.disabledButton, { backgroundColor: Colors[theme].tint, shadowColor: Colors[theme].tint }]} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>บันทึกข้อมูล</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarHint: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Kanit_400Regular',
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Kanit_700Bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
  },
  textArea: {
    height: 100,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  saveButton: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: 'Kanit_700Bold',
  },
});
