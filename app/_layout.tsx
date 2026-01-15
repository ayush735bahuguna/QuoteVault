import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import 'react-native-reanimated';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'QUOTE_VAULT_CACHE_v1',
});

import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { SettingsProvider, useSettings } from '@/src/context/SettingsContext';
import { registerForPushNotificationsAsync } from '@/src/utils/notifications';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/src/constants';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isPasswordReset } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (isPasswordReset) {
      if (segments[1] !== 'reset-password') {
        router.replace('/auth/reset-password');
      }
    } else if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated
      router.replace('/private/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, isPasswordReset]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator size="large" color="#C65D3B" />
      </View>
    );
  }

  return <>{children}</>;
}

function RootLayoutNav() {
  const { isDark, colors } = useSettings();

  const navTheme = {
    dark: isDark,
    colors: {
      primary: colors.primary.DEFAULT,
      background: isDark ? Colors.background.dark : Colors.background.light,
      card: isDark ? Colors.surface.dark : Colors.surface.light,
      text: isDark ? Colors.text.primary.dark : Colors.text.primary.light,
      border: isDark ? Colors.border.dark : Colors.border.light,
      notification: colors.primary.DEFAULT,
    },
    fonts: DefaultTheme.fonts,
  };

  return (
    <ThemeProvider value={navTheme}>
      <View style={{ flex: 1 }}>
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" />
            <Stack.Screen name="private" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthGate>
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      registerForPushNotificationsAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}>
      <AuthProvider>
        <SettingsProvider>
          <RootLayoutNav />
        </SettingsProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}
