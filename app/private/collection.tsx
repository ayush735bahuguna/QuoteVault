import { Colors } from '@/src/constants';
import { useSettings } from '@/src/context';
import { useCollectionQuotes } from '@/src/hooks/useCollectionQuotes';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CollectionDetailScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { isDark } = useSettings();

  const { data: quotes, isLoading } = useCollectionQuotes(id || '');

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <Stack.Screen
        options={{
          headerTitle: name || 'Collection',
        }}
      />
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} className="mt-8" />
        ) : quotes && quotes.length > 0 ? (
          quotes.map((quote) => (
            <TouchableOpacity
              key={quote.id}
              onPress={() => router.push(`/private/quote?id=${quote.id}`)}
              className="mb-4 rounded-2xl border border-border-light bg-surface-light p-5 dark:border-border-dark dark:bg-surface-dark">
              <Text className="mb-3 font-serif text-lg text-text-primary-light dark:text-text-primary-dark">
                "{quote.content}"
              </Text>
              <Text className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                — {quote.author}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center py-12">
            <MaterialIcons name="bookmark-border" size={48} color={Colors.text.secondary.light} />
            <Text className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">
              No quotes in this collection yet
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/private')}
              className="mt-4 rounded-xl bg-primary px-6 py-3">
              <Text className="font-bold text-white">Find Quotes</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
