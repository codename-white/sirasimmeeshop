import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// [NOTE] Maker: โปรดใส่ Supabase URL และ Anon Key ของคุณที่นี่
const supabaseUrl = 'https://lsctinvlisgyasqgmivm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzY3RpbnZsaXNneWFzcWdtaXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNjkwNTMsImV4cCI6MjA4Njg0NTA1M30.gkRKU5AHwbUm_opziYD9nccaoYosSZxK9iX4ak3H3Yc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
