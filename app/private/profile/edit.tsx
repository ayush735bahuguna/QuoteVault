import { Colors, Strings } from '@/src/constants';
import { useAuth, useSettings } from '@/src/context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { isDark } = useSettings();

  const [username, setUsername] = useState(user?.profile?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatar_url || '');
  // const [bio, setBio] = useState(user?.profile?.bio || '');
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
      // bio is not in Profile interface yet, but prepared for expansion
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
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-border-light/50 bg-background-light/95 px-4 pb-4 pt-2 dark:border-white/5 dark:bg-background-dark/95">
          <TouchableOpacity className="-ml-2 p-2" onPress={() => router.back()}>
            <MaterialIcons
              name="close"
              size={24}
              color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
            Edit Profile
          </Text>
          <TouchableOpacity onPress={handleUpdate} disabled={isLoading} className="p-2">
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary.DEFAULT} />
            ) : (
              <Text className="font-bold text-primary">Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 pt-8">
          {/* Avatar Section */}
          <View className="mb-8 items-center">
            <View className="relative mb-4">
              <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-border-light bg-surface-light shadow-sm dark:border-white/10 dark:bg-surface-dark">
                {avatarUrl ? (
                  // Use Image component here if you have it imported, else fallback to View/Icon
                  <MaterialIcons name="image" size={40} color={Colors.text.secondary.light} />
                ) : (
                  <Text className="text-3xl font-bold text-primary">
                    {username.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 rounded-full bg-primary p-2 shadow-md">
                <MaterialIcons name="camera-alt" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Tap to change avatar
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            <View>
              <Text className="mb-2 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Username
              </Text>
              <TextInput
                className="rounded-xl border border-border-light bg-surface-light px-4 py-3 text-base text-text-primary-light dark:border-white/10 dark:bg-surface-dark dark:text-text-primary-dark"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor={Colors.text.secondary.light}
              />
            </View>

            <View>
              <Text className="mb-2 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Avatar URL
              </Text>
              <TextInput
                className="rounded-xl border border-border-light bg-surface-light px-4 py-3 text-base text-text-primary-light dark:border-white/10 dark:bg-surface-dark dark:text-text-primary-dark"
                value={avatarUrl}
                onChangeText={setAvatarUrl}
                placeholder="https://example.com/avatar.jpg"
                placeholderTextColor={Colors.text.secondary.light}
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="mb-2 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Bio
              </Text>
              {/* <TextInput
                className="h-32 rounded-xl border border-border-light bg-surface-light px-4 py-3 text-base text-text-primary-light dark:border-white/10 dark:bg-surface-dark dark:text-text-primary-dark"
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor={Colors.text.secondary.light}
                multiline
                textAlignVertical="top"
              /> */}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
