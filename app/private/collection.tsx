import { Colors } from '@/src/constants';
import { useSettings } from '@/src/context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Sample collection data
const SAMPLE_COLLECTIONS: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Morning Motivation',
    description: 'Quotes to start your day right',
    quotes: [
      {
        id: '1',
        content: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
      },
      {
        id: '4',
        content: 'It does not matter how slowly you go as long as you do not stop.',
        author: 'Confucius',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Work Wisdom',
    quotes: [],
  },
};

export default function CollectionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useSettings();

  const collection = SAMPLE_COLLECTIONS[id || '1'] || SAMPLE_COLLECTIONS['1'];

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border-light/50 bg-background-light/95 px-4 pb-4 pt-14 dark:border-white/5 dark:bg-background-dark/95">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <MaterialIcons name="arrow-back-ios" size={22} color={Colors.primary.DEFAULT} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
          {collection.name}
        </Text>
        <TouchableOpacity className="p-2">
          <MaterialIcons
            name="more-vert"
            size={24}
            color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Collection Info */}
        <View className="mb-8 items-center">
          <View className="mb-4 h-24 w-24 rounded-2xl bg-gradient-to-br from-orange-200 to-amber-200" />
          <Text className="font-serif text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {collection.name}
          </Text>
          <Text className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {collection.quotes?.length || 0} quotes
          </Text>
        </View>

        {/* Quotes */}
        {collection.quotes?.length > 0 ? (
          collection.quotes.map((quote: any) => (
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
            <TouchableOpacity className="mt-4 rounded-xl bg-primary px-6 py-3">
              <Text className="font-bold text-white">Add Quotes</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
