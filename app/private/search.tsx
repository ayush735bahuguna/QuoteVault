import { QuoteCard } from '@/src/components/QuoteCard';
import { Colors, Strings } from '@/src/constants';
import { useSettings } from '@/src/context';
import { useFavorites } from '@/src/hooks/useFavorites';
import { useQuotes } from '@/src/hooks/useQuotes';
import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDebounce } from '@/src/hooks/useDebounce';

export default function SearchScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q: string }>();
  const { isDark, colors } = useSettings();
  const [searchText, setSearchText] = useState(q || '');
  const debouncedSearchText = useDebounce(searchText, 500);
  const { favoriteIds, toggleFavorite } = useFavorites();

  const {
    data: quotes,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQuotes(undefined, debouncedSearchText);

  const handleFavorite = async (quoteId: string) => {
    try {
      await toggleFavorite(quoteId);
    } catch (error) {
      // Failed to toggle favorite
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={['top']}>
      {/* Search Header */}
      <View className="flex-row items-center border-b border-border-light/50 bg-background-light px-4 pb-4 pt-2 dark:border-white/5 dark:bg-background-dark">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
          />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center rounded-xl bg-surface-light px-3 py-2 dark:bg-surface-dark">
          <MaterialIcons
            name="search"
            size={20}
            color={isDark ? Colors.text.secondary.dark : Colors.text.secondary.light}
          />
          <TextInput
            className="flex-1 px-3 text-base text-text-primary-light dark:text-text-primary-dark"
            placeholder={Strings.quotes.searchPlaceholder || 'Search quotes...'}
            placeholderTextColor={isDark ? Colors.text.secondary.dark : Colors.text.secondary.light}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <MaterialIcons
                name="close"
                size={20}
                color={isDark ? Colors.text.secondary.dark : Colors.text.secondary.light}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-1">
        <FlashList
          data={quotes?.pages.flat() || []}
          extraData={favoriteIds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-6 pb-4">
              <QuoteCard
                quote={item}
                onPress={() => router.push(`/private/quote?id=${item.id}`)}
                onFavorite={() => handleFavorite(item.id)}
                isFavorited={favoriteIds.has(item.id)}
              />
            </View>
          )}
          ListEmptyComponent={
            !isLoading ? (
              <View className="flex-1 items-center justify-center pt-20">
                <Text className="text-center text-text-secondary-light dark:text-text-secondary-dark">
                  {searchText
                    ? Strings.quotes.noQuotes || 'No quotes found'
                    : 'Type to search quotes...'}
                </Text>
              </View>
            ) : (
              <ActivityIndicator size="large" color={colors.primary.DEFAULT} className="mt-8" />
            )
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary.DEFAULT}
            />
          }
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      </View>
    </SafeAreaView>
  );
}
