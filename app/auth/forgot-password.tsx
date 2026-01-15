import { Colors, Strings } from '@/src/constants';
import { useAuth } from '@/src/context';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email.trim());
    setIsLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setIsEmailSent(true);
    }
  };

  if (isEmailSent) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light px-6 dark:bg-background-dark">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-green-500">
          <MaterialIcons name="check" size={40} color="#FFF" />
        </View>
        <Text className="mb-4 text-center font-serif text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Check Your Email
        </Text>
        <Text className="mb-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
          We've sent a password reset link to {email}
        </Text>
        <Link href="/auth/login" asChild>
          <TouchableOpacity className="rounded-xl bg-primary px-8 py-4">
            <Text className="text-base font-bold text-white">Back to Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
        className="bg-background-light dark:bg-background-dark">
        {/* Back Button */}
        <Link href="/auth/login" asChild>
          <TouchableOpacity className="absolute left-6 top-12 p-2">
            <MaterialIcons name="arrow-back" size={24} color={Colors.primary.DEFAULT} />
          </TouchableOpacity>
        </Link>

        {/* Header */}
        <View className="mb-10 mt-8 items-center">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg">
            <MaterialIcons name="lock-reset" size={40} color="#FFF9F0" />
          </View>
          <Text className="font-serif text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {Strings.auth.resetPassword}
          </Text>
          <Text className="mt-2 px-8 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Enter your email address and we'll send you a link to reset your password
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Email Input */}
          <View>
            <Text className="mb-2 ml-1 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              {Strings.auth.email}
            </Text>
            <View className="flex-row items-center rounded-xl border border-border-light bg-surface-light px-4 py-3 dark:border-border-dark dark:bg-surface-dark">
              <MaterialIcons name="email" size={20} color={Colors.text.secondary.light} />
              <TextInput
                className="ml-3 flex-1 text-base text-text-primary-light dark:text-text-primary-dark"
                placeholder="Enter your email"
                placeholderTextColor={Colors.text.secondary.light}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={isLoading}
            className="mt-6 items-center rounded-xl bg-primary py-4 shadow-lg"
            style={{ shadowColor: Colors.primary.DEFAULT, shadowOpacity: 0.3 }}>
            {isLoading ? (
              <ActivityIndicator color="#FFF9F0" />
            ) : (
              <Text className="text-base font-bold text-white">Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Back to Login Link */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-text-secondary-light dark:text-text-secondary-dark">
            Remember your password?{' '}
          </Text>
          <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <Text className="font-bold text-primary">{Strings.auth.login}</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
