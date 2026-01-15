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

import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
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
    const { error } = await signUp(email.trim(), password, username.trim());
    setIsLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert('Success', 'Account created! Please check your email to verify your account.', [
        { text: 'OK', onPress: () => router.replace('/auth/login') },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-12"
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View className="mb-10 items-center">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg">
              <MaterialIcons name="person-add" size={40} color="#FFF9F0" />
            </View>
            <Text className="font-serif text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {Strings.auth.createAccount}
            </Text>
            <Text className="mt-2 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Join QuoteVault to save and discover quotes
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Username Input */}
            <View>
              <Text className="mb-2 ml-1 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {Strings.auth.username}
              </Text>
              <View className="flex-row items-center rounded-xl border border-border-light bg-surface-light px-4 py-3 dark:border-border-dark dark:bg-surface-dark">
                <MaterialIcons name="person" size={20} color={Colors.text.secondary.light} />
                <TextInput
                  className="ml-3 flex-1 text-base text-text-primary-light dark:text-text-primary-dark"
                  placeholder="Enter your username"
                  placeholderTextColor={Colors.text.secondary.light}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mt-4">
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

            {/* Password Input */}
            <View className="mt-4">
              <Text className="mb-2 ml-1 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {Strings.auth.password}
              </Text>
              <View className="flex-row items-center rounded-xl border border-border-light bg-surface-light px-4 py-3 dark:border-border-dark dark:bg-surface-dark">
                <MaterialIcons name="lock" size={20} color={Colors.text.secondary.light} />
                <TextInput
                  className="ml-3 flex-1 text-base text-text-primary-light dark:text-text-primary-dark"
                  placeholder="Create a password"
                  placeholderTextColor={Colors.text.secondary.light}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
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
            <View className="mt-4">
              <Text className="mb-2 ml-1 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {Strings.auth.confirmPassword}
              </Text>
              <View className="flex-row items-center rounded-xl border border-border-light bg-surface-light px-4 py-3 dark:border-border-dark dark:bg-surface-dark">
                <MaterialIcons name="lock-outline" size={20} color={Colors.text.secondary.light} />
                <TextInput
                  className="ml-3 flex-1 text-base text-text-primary-light dark:text-text-primary-dark"
                  placeholder="Confirm your password"
                  placeholderTextColor={Colors.text.secondary.light}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={isLoading}
              className="mt-6 items-center rounded-xl bg-primary py-4 shadow-lg"
              style={{ shadowColor: Colors.primary.DEFAULT, shadowOpacity: 0.3 }}>
              {isLoading ? (
                <ActivityIndicator color="#FFF9F0" />
              ) : (
                <Text className="text-base font-bold text-white">{Strings.auth.signup}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="mt-8 flex-row justify-center">
            <Text className="text-text-secondary-light dark:text-text-secondary-dark">
              {Strings.auth.alreadyHaveAccount}{' '}
            </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text className="font-bold text-primary">{Strings.auth.login}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
