import { QuoteCard } from '@/src/components/QuoteCard';
import { Colors } from '@/src/constants';
import { useSettings } from '@/src/context';
import { useFavorites } from '@/src/hooks/useFavorites';
import { useQuotes } from '@/src/hooks/useQuotes';
import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { colors, isDark } = useSettings();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const { data: quotes, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useQuotes(id);

  const handleFavorite = async (quoteId: string) => {
    try {
      await toggleFavorite(quoteId);
    } catch (error) {
      // Failed to toggle favorite
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <Stack.Screen
        options={{
          headerTitle: name || 'Category',
        }}
      />

      <View className="flex-1">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
          </View>
        ) : (
          <FlashList
            data={quotes?.pages.flat() || []}
            extraData={favoriteIds}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
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
              <View className="mt-12 items-center px-6">
                <Text className="text-center text-text-secondary-light dark:text-text-secondary-dark">
                  No quotes found for this category.
                </Text>
              </View>
            }
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              <View className="py-6">
                {isFetchingNextPage ? (
                  <ActivityIndicator size="small" color={Colors.primary.DEFAULT} />
                ) : null}
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
