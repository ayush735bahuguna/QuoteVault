import { Colors, Strings } from '@/src/constants';
import { useSettings } from '@/src/context';
import { useCategories } from '@/src/hooks/useCategories';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthors } from '@/src/hooks/useAuthors';

export default function ExploreScreen() {
  const router = useRouter();
  const { isDark } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: categories } = useCategories();
  const { data: authors } = useAuthors();

  const handleCategoryPress = (category: any) => {
    router.push(`/private/category?id=${category.id}&name=${encodeURIComponent(category.name)}`);
  };

  const handleAuthorPress = (authorName: string) => {
    router.push(`/private/search?q=${encodeURIComponent(authorName)}`);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Categories Section */}
        <View className="mb-8">
          <View className="mb-4 flex-row items-center justify-between px-6">
            <Text className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
              {Strings.quotes.collections}
            </Text>
          </View>

          <View className="flex-row flex-wrap px-4">
            {categories?.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category)}
                className="w-1/2 p-2">
                <View
                  className="items-center rounded-2xl p-5"
                  style={{ backgroundColor: `${category.color || '#8D6E63'}15` }}>
                  <View
                    className="mb-3 h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${category.color || '#8D6E63'}25` }}>
                    <MaterialIcons
                      name={(category.icon as any) || 'category'}
                      size={24}
                      color={category.color || '#8D6E63'}
                    />
                  </View>
                  <Text
                    className="text-base font-bold"
                    style={{ color: category.color || '#8D6E63' }}>
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
              Popular Authors
            </Text>
          </View>

          {authors?.map((author) => (
            <TouchableOpacity
              key={author.id}
              onPress={() => handleAuthorPress(author.name)}
              className="mb-3 flex-row items-center rounded-xl border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-secondary/30">
                <Text className="text-lg font-bold text-text-secondary-light">
                  {author.name.charAt(0)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
                  {author.name}
                </Text>
                <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {author.quoteCount} quotes
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={isDark ? Colors.text.secondary.dark : Colors.text.secondary.light}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
