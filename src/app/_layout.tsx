import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { ActivityDraftProvider } from '@/providers/ActivityDraftProvider';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { ProfileSetupProvider } from '@/providers/ProfileSetupProvider';
import { ThemeProvider, useTheme } from '@/providers/ThemeProvider';

SplashScreen.preventAutoHideAsync();

const PROTECTED_ROOTS = new Set([
  '(tabs)',
  'settings',
  'edit-profile',
  'best-runners',
  'clubs',
  'activity',
  'run',
]);

function AuthGate() {
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const segmentKey = segments.join('/');

  useEffect(() => {
    if (status !== 'unauthenticated') return;

    const root = segmentKey.split('/')[0];
    if (root && PROTECTED_ROOTS.has(root)) {
      router.replace('/(auth)/login');
    }
  }, [status, segmentKey, router]);

  return null;
}

function RootNavigator({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { isDark } = useTheme();
  const { status } = useAuth();

  useEffect(() => {
    if (fontsLoaded && status !== 'bootstrapping') {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, status]);

  if (!fontsLoaded || status === 'bootstrapping') {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthGate />
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          animationDuration: 260,
          gestureEnabled: true,
          contentStyle: {
            backgroundColor: isDark ? '#121212' : '#ffffff',
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="best-runners" options={{ headerShown: false }} />
        <Stack.Screen name="clubs" options={{ headerShown: false }} />
        <Stack.Screen
          name="activity/[id]"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="run/active-run"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="run/activity-details"
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    'Eina03-SemiBold': require('../../assets/fonts/Eina03-SemiBold.ttf'),
  });

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileSetupProvider>
          <ActivityDraftProvider>
            <RootNavigator fontsLoaded={loaded} />
          </ActivityDraftProvider>
        </ProfileSetupProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
