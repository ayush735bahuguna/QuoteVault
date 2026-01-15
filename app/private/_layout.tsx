import { Stack } from 'expo-router';
import { useSettings } from '@/src/context';
import { Colors } from '@/src/constants';

export default function PrivateLayout() {
  const { isDark } = useSettings();
  const bgColor = isDark ? Colors.background.dark : Colors.background.light;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="quote"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
          animation: 'slide_from_right',
          headerShown: true,
          headerTitle: 'Settings',
          headerStyle: { backgroundColor: bgColor },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="customize"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: bgColor },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="collection"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: bgColor },
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="category"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: bgColor },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="addQuote"
        options={{
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
