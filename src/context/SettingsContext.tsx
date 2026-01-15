import { supabase } from '@/src/lib/supabase';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors, Themes } from '../constants';
import { cancelNotifications, scheduleDailyReminder } from '../utils/notifications';
import { FontSize, Settings, ThemeMode, ThemeName } from '../types';

interface SettingsContextType {
  settings: Settings;
  isDark: boolean;
  currentTheme: typeof Themes.goldenHour;
  colors: typeof Colors;

  setThemeMode: (mode: ThemeMode) => void;
  setThemeName: (name: ThemeName) => void;
  setFontSize: (size: FontSize) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationTime: (time: string) => void;
  getFontSizeValue: () => number;
}

const defaultSettings: Settings = {
  themeMode: 'system',
  themeName: 'goldenHour',
  fontSize: 'medium',
  notificationsEnabled: true,
  notificationTime: '09:00',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_KEY = '@quotevault_settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const systemColorScheme = useRNColorScheme();
  const { setColorScheme } = useNativeWindColorScheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from storage and supabase
  useEffect(() => {
    loadSettings();
  }, [user]); // Reload when user changes

  // Save settings when changed
  useEffect(() => {
    if (isLoaded) {
      saveSettings();
    }
  }, [settings, isLoaded]);

  const loadSettings = async () => {
    try {
      // 1. Load local first for speed
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      let localSettings = defaultSettings;
      if (stored) {
        localSettings = { ...defaultSettings, ...JSON.parse(stored) };
        setSettings(localSettings);
      }

      // 2. If logged in, fetch from Supabase and merge
      if (user?.id) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile && !error) {
          const mergedSettings: Settings = {
            ...localSettings,
            themeName: (profile.theme as ThemeName) || localSettings.themeName,
            fontSize: (profile.font_size as FontSize) || localSettings.fontSize,
            notificationsEnabled:
              profile.notifications_enabled ?? localSettings.notificationsEnabled,
            notificationTime: profile.notification_time || localSettings.notificationTime,
            // Theme mode is usually local-only, but could be synced if schema supported it
          };
          setSettings(mergedSettings);
          // Update local storage with fresh cloud data
          await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(mergedSettings));
        }
      }
    } catch (error) {
      // Failed to load settings
    } finally {
      setIsLoaded(true);
    }
  };

  const saveSettings = async () => {
    try {
      // 1. Save locally
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

      // 2. Sync to Supabase if user is logged in
      if (user?.id) {
        const updates = {
          theme: settings.themeName,
          font_size: settings.fontSize,
          notifications_enabled: settings.notificationsEnabled,
          notification_time: settings.notificationTime,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

        if (error) {
          // Failed to sync settings to Supabase
        }
      }
    } catch (error) {
      // Failed to save settings
    }
  };

  // Determine if dark mode is active
  const isDark =
    settings.themeMode === 'dark' ||
    (settings.themeMode === 'system' && systemColorScheme === 'dark');

  // Sync with NativeWind
  useEffect(() => {
    setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark, setColorScheme]);

  // Get current theme config
  const currentTheme = Themes[settings.themeName];

  // Font size values
  const getFontSizeValue = () => {
    switch (settings.fontSize) {
      case 'small':
        return 18;
      case 'large':
        return 28;
      default:
        return 22;
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setSettings((prev) => ({ ...prev, themeMode: mode }));
  };

  const setThemeName = (name: ThemeName) => {
    setSettings((prev) => ({ ...prev, themeName: name }));
  };

  const setFontSize = (size: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setSettings((prev) => {
      const newSettings = { ...prev, notificationsEnabled: enabled };
      if (enabled) {
        scheduleDailyReminder(newSettings.notificationTime);
      } else {
        cancelNotifications();
      }
      return newSettings;
    });
  };

  const setNotificationTime = (time: string) => {
    setSettings((prev) => {
      const newSettings = { ...prev, notificationTime: time };
      if (newSettings.notificationsEnabled) {
        scheduleDailyReminder(time);
      }
      return newSettings;
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isDark,
        currentTheme,
        // Merge current theme primary color into the colors object
        colors: {
          ...Colors,
          primary: {
            ...Colors.primary,
            DEFAULT: currentTheme.primary,
          },
        },
        setThemeMode,
        setThemeName,
        setFontSize,
        setNotificationsEnabled,
        setNotificationTime,
        getFontSizeValue,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
