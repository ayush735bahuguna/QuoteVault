import { Colors, Strings } from '@/src/constants';
import { useAuth } from '@/src/context';
import { supabase } from '@/src/lib/supabase';
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password.trim(),
      });

      setIsLoading(false);

      if (error) throw error;

      Alert.alert('Success', 'Your password has been updated', [
        {
          text: 'OK',
          onPress: () => {
            // Sign out to clear the recovery session, then redirect to login
            signOut();
            router.replace('/auth/login');
          },
        },
      ]);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to update password');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
        className="bg-background-light dark:bg-background-dark">
        {/* Header */}
        <View className="mb-10 mt-8 items-center">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg">
            <MaterialIcons name="lock" size={40} color="#FFF9F0" />
          </View>
          <Text className="font-serif text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Reset Password
          </Text>
          <Text className="mt-2 px-8 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Enter your new password below
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* New Password Input */}
          <View>
            <Text className="mb-2 ml-1 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              New Password
            </Text>
            <View className="flex-row items-center rounded-xl border border-border-light bg-surface-light px-4 py-3 dark:border-border-dark dark:bg-surface-dark">
              <MaterialIcons name="lock" size={20} color={Colors.text.secondary.light} />
              <TextInput
                className="ml-3 flex-1 text-base text-text-primary-light dark:text-text-primary-dark"
                placeholder="Enter new password"
                placeholderTextColor={Colors.text.secondary.light}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={Colors.text.secondary.light}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View>
            <Text className="my-2 ml-1 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              Confirm Password
            </Text>
            <View className="flex-row items-center rounded-xl border border-border-light bg-surface-light px-4 py-3 dark:border-border-dark dark:bg-surface-dark">
              <MaterialIcons name="lock" size={20} color={Colors.text.secondary.light} />
              <TextInput
                className="ml-3 flex-1 text-base text-text-primary-light dark:text-text-primary-dark"
                placeholder="Confirm new password"
                placeholderTextColor={Colors.text.secondary.light}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <MaterialIcons
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={Colors.text.secondary.light}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity
            onPress={handleUpdatePassword}
            disabled={isLoading}
            className="mt-6 items-center rounded-xl bg-primary py-4 shadow-lg"
            style={{ shadowColor: Colors.primary.DEFAULT, shadowOpacity: 0.3 }}>
            {isLoading ? (
              <ActivityIndicator color="#FFF9F0" />
            ) : (
              <Text className="text-base font-bold text-white">Update Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
