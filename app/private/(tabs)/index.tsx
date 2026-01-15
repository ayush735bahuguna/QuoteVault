import { AddToCollectionModal } from '@/src/components/AddToCollectionModal';
import { QuoteCard } from '@/src/components/QuoteCard';
import { QuoteOfDayCard } from '@/src/components/QuoteOfDayCard';
import { Strings } from '@/src/constants';
import { useSettings } from '@/src/context';
import { useCategories } from '@/src/hooks/useCategories';
import { useDailyQuote } from '@/src/hooks/useDailyQuote';
import { useFavorites } from '@/src/hooks/useFavorites';
import { useQuotes } from '@/src/hooks/useQuotes';
import { supabase } from '@/src/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
import { ActivityIndicator, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();

  const { colors } = useSettings(); // Use colors from context
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const {
    data: quotes,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQuotes(selectedCategory || undefined);
  const { data: categories } = useCategories();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { data: dailyQuote } = useDailyQuote();

  const [collectionModalVisible, setCollectionModalVisible] = useState(false);
  const [selectedQuoteToAdd, setSelectedQuoteToAdd] = useState<string | null>(null);

  const handleAddToCollectionPress = (quoteId: string) => {
    setSelectedQuoteToAdd(quoteId);
    setCollectionModalVisible(true);
  };

  const handleAssignToCollection = async (collectionId: string) => {
    if (!selectedQuoteToAdd) return;

    // Check for duplicate
    const { data: existing } = await supabase
      .from('collection_items')
      .select('id')
      .eq('collection_id', collectionId)
      .eq('quote_id', selectedQuoteToAdd)
      .single();

    if (existing) {
      alert('This quote is already in the collection');
      return;
    }

    const { error } = await supabase.from('collection_items').insert({
      collection_id: collectionId,
      quote_id: selectedQuoteToAdd,
    });

    if (error) {
      alert('Failed to add to collection');
    } else {
      setCollectionModalVisible(false);
      alert('Quote added to collection!');
    }
  };

  const handleFavorite = async (quoteId: string) => {
    try {
      await toggleFavorite(quoteId);
    } catch (error) {
      // Favorite toggle error handled silently
    }
  };

  const onSelectHandler = (cat: string | null) => {
    setSelectedCategory(cat);
  };

  // const renderCategoryPills = useMemo(() => {
  //   return (
  //     <CategoryPills
  //       categories={categories || []}
  //       selectedCategory={selectedCategory}
  //       onSelect={onSelectHandler}
  //     />
  //   );
  // }, [categories, selectedCategory, onSelectHandler]);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
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
                onAddToCollection={() => handleAddToCollectionPress(item.id)}
              />
            </View>
          )}
          ListHeaderComponent={
            <>
              <View className="pt-2">
                {dailyQuote ? (
                  <QuoteOfDayCard quote={dailyQuote} />
                ) : (
                  <View className="mx-6 h-48 items-center justify-center rounded-2xl bg-surface-light dark:bg-surface-dark">
                    <ActivityIndicator color={colors.primary.DEFAULT} />
                  </View>
                )}
              </View>

              <Text className="mx-6 mb-2 mt-4 text-xl font-semibold">Quotes feed</Text>

              {/* <View className="h-2" />
              {renderCategoryPills}
              <View className="h-4" /> */}
            </>
          }
          ListFooterComponent={
            <View className="py-6">
              {isFetchingNextPage ? (
                <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
              ) : !hasNextPage && (quotes?.pages.flat().length || 0) > 0 ? (
                <Text className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  You've reached the end
                </Text>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            !isLoading ? (
              <Text className="mt-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                {Strings.quotes.noQuotes}
              </Text>
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      <TouchableOpacity
        onPress={() => router.push('/private/addQuote')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
        style={{
          elevation: 5,
          shadowColor: colors.primary.DEFAULT,
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          backgroundColor: colors.primary.DEFAULT,
        }}>
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
