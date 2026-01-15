import { Colors } from '@/src/constants';
import { useAuth, useSettings } from '@/src/context';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { isDark } = useSettings();

  const [username, setUsername] = useState(user?.profile?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatar_url || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    setIsLoading(true);
    const { error } = await updateProfile({
      username: username.trim(),
      avatar_url: avatarUrl.trim() || null,
    });
    setIsLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to update profile');
    } else {
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-light dark:bg-background-dark">
      <Stack.Screen
        options={{
          headerTitle: 'Edit Profile',
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: isDark ? Colors.background.dark : Colors.background.light,
          },
          headerTintColor: isDark ? Colors.text.primary.dark : Colors.text.primary.light,
          headerRight: () => (
            <TouchableOpacity onPress={handleUpdate} disabled={isLoading} className="mr-2">
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary.DEFAULT} />
              ) : (
                <Text className="text-base font-bold text-primary">Save</Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        <View className="mb-8 items-center">
          <TouchableOpacity className="relative mb-4">
            <View className="h-28 w-28 items-center justify-center rounded-full border-4 border-surface-light bg-surface-light shadow-soft dark:border-surface-dark dark:bg-surface-dark">
              {avatarUrl ? (
                // In a real app, use <Image source={{ uri: avatarUrl }} className="h-full w-full rounded-full" />
                <View className="bg-surface-variant-light dark:bg-surface-variant-dark h-full w-full items-center justify-center rounded-full">
                  <MaterialIcons name="person" size={48} color={Colors.text.secondary.light} />
                </View>
              ) : (
                <Text className="text-4xl font-bold text-primary">
                  {username.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <View className="absolute bottom-0 right-0 rounded-full border-2 border-background-light bg-primary p-2.5 shadow-md dark:border-background-dark">
              <MaterialIcons name="camera-alt" size={18} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="font-medium text-primary">Change Profile Photo</Text>
        </View>

        <View className="space-y-6">
          <View>
            <Text className="mb-2 ml-1 text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
              Username
            </Text>
            <TextInput
              className="rounded-2xl border border-transparent bg-surface-light px-5 py-4 text-base font-medium text-text-primary-light shadow-sm focus:border-primary/50 dark:bg-surface-dark dark:text-text-primary-dark"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={Colors.text.secondary.light}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View>
            <Text className="mb-2 ml-1 mt-2 text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
              Avatar URL
            </Text>
            <TextInput
              className="rounded-2xl border border-transparent bg-surface-light px-5 py-4 text-base font-medium text-text-primary-light shadow-sm focus:border-primary/50 dark:bg-surface-dark dark:text-text-primary-dark"
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              placeholder="https://example.com/avatar.jpg"
              placeholderTextColor={Colors.text.secondary.light}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <Text className="ml-1 mt-2 text-xs text-text-secondary-light/70 dark:text-text-secondary-dark/70">
              Paste a direct link to an image to update your avatar.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
