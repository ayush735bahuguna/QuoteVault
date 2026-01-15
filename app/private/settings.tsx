import { Colors, Strings, Themes } from '@/src/constants';
import { useAuth, useSettings } from '@/src/context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import React from 'react';
import { Alert, Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { settings, isDark, setThemeMode, setThemeName, setFontSize, setNotificationsEnabled } =
    useSettings();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const themeOptions = [
    {
      key: 'goldenHour',
      name: 'Golden Hour',
      gradient: ['#C65D3B', '#E67E22'],
    },
    { key: 'noir', name: 'Dark Espresso', gradient: ['#3E2723', '#1a120f'] },
    { key: 'classic', name: 'Morning Sand', gradient: ['#D7CCC8', '#A1887F'] },
  ];

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Card */}
        <View className="relative mb-6 overflow-hidden rounded-2xl border border-border-light/50 bg-surface-light p-4 shadow-soft dark:border-white/5 dark:bg-surface-dark">
          <View className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
          <View className="relative z-10 flex-row items-center gap-4">
            <View className="relative">
              {user?.profile?.avatar_url ? (
                <Image
                  source={{ uri: user.profile.avatar_url }}
                  className="h-20 w-20 rounded-full border-2 border-orange-50 shadow-md"
                />
              ) : (
                <View className="h-20 w-20 items-center justify-center rounded-full bg-primary shadow-md">
                  <Text className="text-2xl font-bold text-white">
                    {user?.profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
              <View className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary">
                <MaterialIcons name="check" size={14} color="#FFF" />
              </View>
            </View>
            <View className="flex-1">
              <Text className="font-serif text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {user?.profile?.username || 'User'}
              </Text>
              <Text className="mb-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {Strings.auth.username}
              </Text>
              <TouchableOpacity
                className="flex-row items-center gap-1"
                onPress={() => router.push('/private/profile/edit')}>
                <Text className="text-sm font-medium text-primary">
                  {Strings.settings.editProfile}
                </Text>
                <MaterialIcons name="arrow-forward" size={16} color={Colors.primary.DEFAULT} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View className="mb-6">
          <Text className="mb-3 px-2 text-xs font-bold uppercase tracking-widest text-text-secondary-light opacity-80 dark:text-text-secondary-dark">
            {Strings.settings.preferences}
          </Text>
          <View className="overflow-hidden rounded-xl border border-border-light/50 bg-surface-light shadow-soft dark:border-white/5 dark:bg-surface-dark">
            {/* Dark Mode */}
            <View className="flex-row items-center justify-between border-b border-border-light/50 p-4 dark:border-white/5">
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-text-primary-light/5 dark:bg-text-primary-dark/10">
                  <MaterialIcons
                    name="dark-mode"
                    size={20}
                    color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
                  />
                </View>
                <Text className="text-base font-medium text-text-primary-light dark:text-text-primary-dark">
                  {Strings.settings.darkMode}
                </Text>
              </View>
              <Switch
                value={settings.themeMode === 'dark'}
                onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                trackColor={{ false: '#E7E5E4', true: Colors.primary.DEFAULT }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Daily Quote */}
            <View className="flex-row items-center justify-between border-b border-border-light/50 p-4 dark:border-white/5">
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <MaterialIcons name="format-quote" size={20} color="#D97706" />
                </View>
                <Text className="text-base font-medium text-text-primary-light dark:text-text-primary-dark">
                  {Strings.settings.dailyQuote}
                </Text>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E7E5E4', true: Colors.primary.DEFAULT }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Notification Time */}
            <TouchableOpacity className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                  <MaterialIcons name="schedule" size={20} color={Colors.primary.DEFAULT} />
                </View>
                <Text className="text-base font-medium text-text-primary-light dark:text-text-primary-dark">
                  {Strings.settings.notificationTime}
                </Text>
              </View>
              <View className="flex-row items-center gap-2 rounded-lg bg-stone-100 px-3 py-1 dark:bg-white/5">
                <Text className="text-sm font-semibold text-primary">
                  {settings.notificationTime || '08:00'} AM
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Appearance Section */}
        <View className="mb-6">
          <Text className="mb-3 px-2 text-xs font-bold uppercase tracking-widest text-text-secondary-light opacity-80 dark:text-text-secondary-dark">
            {Strings.settings.appearance}
          </Text>
          <View className="rounded-xl border border-border-light/50 bg-surface-light p-5 shadow-soft dark:border-white/5 dark:bg-surface-dark">
            {/* Theme Selection */}
            <View className="mb-6">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {Strings.settings.theme}
                </Text>
                <Text className="text-xs font-bold text-primary">
                  {Themes[settings.themeName]?.name || 'Golden Hour'}
                </Text>
              </View>
              <View className="flex-row gap-4">
                {themeOptions.map((theme) => (
                  <TouchableOpacity
                    key={theme.key}
                    onPress={() => setThemeName(theme.key as any)}
                    className={`h-16 flex-1 overflow-hidden rounded-xl ${
                      settings.themeName === theme.key ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{
                      backgroundColor: theme.gradient[0],
                      borderWidth: settings.themeName === theme.key ? 2 : 0,
                      borderColor: Colors.primary.DEFAULT,
                    }}>
                    {settings.themeName === theme.key && (
                      <View className="absolute inset-0 items-center justify-center">
                        <MaterialIcons name="check-circle" size={24} color="#FFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-6 h-px w-full bg-border-light dark:bg-white/5" />

            {/* Font Size */}
            <View>
              <Text className="mb-4 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {Strings.settings.textSize}
              </Text>
              <View className="rounded-lg border border-border-light bg-background-light p-4 dark:border-white/5 dark:bg-background-dark/30">
                <Text
                  className="mb-6 text-center font-serif leading-relaxed text-text-primary-light dark:text-text-primary-dark"
                  style={{
                    fontSize:
                      settings.fontSize === 'small' ? 14 : settings.fontSize === 'large' ? 22 : 18,
                  }}>
                  "The golden hour of the soul is found in quiet moments."
                </Text>
                <View className="flex-row items-center gap-4">
                  <Text className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark">
                    Tt
                  </Text>
                  <Slider
                    style={{ flex: 1, height: 40 }}
                    minimumValue={0}
                    maximumValue={2}
                    step={1}
                    value={
                      settings.fontSize === 'small' ? 0 : settings.fontSize === 'large' ? 2 : 1
                    }
                    onSlidingComplete={(value) => {
                      if (value === 0) setFontSize('small');
                      else if (value === 1) setFontSize('medium');
                      else setFontSize('large');
                    }}
                    minimumTrackTintColor={Colors.primary.DEFAULT}
                    maximumTrackTintColor={isDark ? Colors.border.dark : Colors.border.light}
                    thumbTintColor={Colors.primary.DEFAULT}
                  />
                  <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Tt
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View className="pb-8 pt-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="border-danger/30 bg-danger/5 w-full flex-row items-center justify-center gap-2 rounded-xl border px-4 py-3.5">
            <MaterialIcons name="logout" size={20} color={Colors.danger} />
            <Text className="text-danger font-bold tracking-wide">{Strings.auth.logout}</Text>
          </TouchableOpacity>
          <Text className="mt-4 text-center text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
            QuoteVault v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
