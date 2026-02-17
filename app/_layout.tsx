import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { supabase } from '../src/services/supabase';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  // SpaceMono is missing, so we'll skip loading it for now to fix the crash
  const loaded = true;

  useEffect(() => {
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // If user is NOT logged in and NOT in auth pages, redirect to login
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // If user IS logged in and in auth pages, redirect to home
      router.replace('/(tabs)');
    }
  }, [session, initialized, segments]);

  if (!loaded || !initialized) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="checkout" options={{ presentation: 'card' }} />
        <Stack.Screen name="orders" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
