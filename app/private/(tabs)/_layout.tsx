import { Colors } from '@/src/constants';
import { useSettings } from '@/src/context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { isDark } = useSettings();
  const activeColor = Colors.primary.DEFAULT;
  const inactiveColor = isDark ? Colors.text.secondary.dark : Colors.text.secondary.light;
  const bgColor = isDark ? Colors.background.dark : Colors.background.light;
  const tabBgColor = isDark ? Colors.background.dark : '#FFFFFF'; // White for light mode
  const borderColor = isDark ? Colors.border.dark : Colors.border.light;

  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          paddingTop: 10,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: tabBgColor,
          borderTopColor: borderColor,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerShown: true, // Enable native header globally for tabs
        headerShadowVisible: false, // Remove shadow/elevation
        headerStyle: {
          backgroundColor: bgColor,
          shadowOpacity: 0,
          elevation: 0,
          borderBottomWidth: 0, // Ensure no border
        },
        headerTitleStyle: {
          color: isDark ? Colors.text.primary.dark : Colors.text.primary.light,
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTintColor: activeColor,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'QuoteVault',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View className="mr-7 flex-row">
              <MaterialCommunityIcons
                name="magnify"
                size={26}
                color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
                onPress={() => router.push('/private/search')}
              />
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={28}
              color={color}
            />
          ),
          tabBarLabel: 'Home',
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Discover',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View className="mr-7 flex-row">
              <MaterialCommunityIcons
                name="magnify"
                size={26}
                color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
                onPress={() => router.push('/private/search')}
              />
            </View>
          ),
          headerTitle: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'compass' : 'compass-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          headerTitle: 'My Library',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'bookmark' : 'bookmark-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settingTab"
        options={{
          title: 'Settings',
          headerTitleAlign: 'center',

          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'cog' : 'cog-outline'}
              size={28}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/private/settings');
          },
        }}
      />
    </Tabs>
  );
}
