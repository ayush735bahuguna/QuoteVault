import { Colors, Strings } from '@/src/constants';
import { useCollections } from '@/src/hooks/useCollections';
import { useFavorites } from '@/src/hooks/useFavorites';
import { Collection, Quote } from '@/src/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
const FILTERS = ['Date Added', 'Books', 'Authors'];

import { LinearGradient } from 'expo-linear-gradient';

function CollectionCard({ collection, onPress }: { collection: Collection; onPress: () => void }) {
  const gradients = [
    ['#fed7aa', '#fde68a'], // orange-200 -> amber-200
    ['#d6d3d1', '#e7e5e4'], // stone-300 -> stone-200
    ['#e7e5e4', '#f5f5f4'], // stone-200 -> stone-100
  ];

  // Deterministic color selection
  const index = collection.id.charCodeAt(0) % gradients.length;
  const gradientColors = gradients[index];

  return (
    <TouchableOpacity onPress={onPress} className="mr-4 w-40">
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mb-3 h-40 w-full items-center justify-center overflow-hidden rounded-3xl border border-white/40 shadow-soft">
        <MaterialIcons name="folder-open" size={48} color="rgba(255,255,255,0.6)" />
        <View className="absolute bottom-3 right-3 rounded-full bg-white/30 px-2.5 py-1">
          <Text className="text-[10px] font-bold text-text-primary-light">
            {collection.quote_count}
          </Text>
        </View>
      </LinearGradient>
      <View className="px-1">
        <Text
          className="font-serif text-base font-bold leading-tight text-text-primary-light dark:text-text-primary-dark"
          numberOfLines={1}>
          {collection.name}
        </Text>
        <Text className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          Updated 2h ago
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Quote Card Component
function FavoriteQuoteCard({
  quote,
  onPress,
  onFavorite,
}: {
  quote: Quote;
  onPress: () => void;
  onFavorite: () => void;
}) {
  const categoryColors: Record<string, { bg: string; text: string }> = {
    Motivation: { bg: 'bg-primary/10', text: 'text-primary' },
    Wisdom: { bg: 'bg-[#8D6E63]/10', text: 'text-[#8D6E63]' },
    Growth: { bg: 'bg-[#5D4037]/10', text: 'text-[#5D4037]' },
  };
  const catColor = categoryColors[quote.category?.name || ''] || {
    bg: 'bg-primary/10',
    text: 'text-primary',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      className="mb-5 rounded-3xl border border-white bg-surface-light p-7 shadow-soft dark:border-border-dark dark:bg-surface-dark">
      {/* Header */}
      <View className="mb-5 flex-row items-start justify-between">
        <View className={`${catColor.bg} rounded-full border border-primary/20 px-3 py-1.5`}>
          <Text className={`${catColor.text} text-[10px] font-bold uppercase tracking-wide`}>
            {quote.category?.name}
          </Text>
        </View>
        <TouchableOpacity className="p-1" onPress={onFavorite}>
          <MaterialIcons name="favorite" size={24} color={Colors.primary.DEFAULT} />
        </TouchableOpacity>
      </View>

      {/* Quote */}
      <View className="relative mb-6">
        <Text className="absolute -left-2 -top-4 font-serif text-6xl text-primary/10">"</Text>
        <Text className="relative z-10 font-serif text-2xl font-medium leading-relaxed text-text-primary-light dark:text-text-primary-dark">
          {quote.content}
        </Text>
      </View>

      {/* Author */}
      <View className="flex-row items-end justify-between border-t border-border-light pt-4 dark:border-border-dark">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 overflow-hidden rounded-full bg-border-light p-0.5 dark:bg-border-dark">
            <View className="h-full w-full items-center justify-center rounded-full bg-secondary/30">
              <Text className="font-bold text-text-secondary-light">{quote.author.charAt(0)}</Text>
            </View>
          </View>
          <View>
            <Text className="font-serif text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
              {quote.author}
            </Text>
            <Text className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
              Saved Oct 24
            </Text>
          </View>
        </View>
        <View className="flex-row gap-1">
          <TouchableOpacity className="p-2">
            <MaterialIcons name="content-copy" size={20} color={Colors.text.secondary.light} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <MaterialIcons name="ios-share" size={20} color={Colors.text.secondary.light} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

import { CreateCollectionModal } from '@/src/components/CreateCollectionModal';
// ... imports

export default function LibraryScreen() {
  const router = useRouter();
  const { favoriteQuotes, toggleFavorite, isLoading: isLoadingFavorites } = useFavorites();
  const { createCollection, data: collections, isLoading: isLoadingCollections } = useCollections();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const handleCreateCollection = async (name: string, description?: string) => {
    await createCollection({ name, description });
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mt-2">
          <View className="mb-6">
            <View className="mb-3 flex-row items-center justify-between px-6">
              <Text className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
                {Strings.quotes.collections}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}>
              {isLoadingCollections ? (
                <ActivityIndicator size="small" color={Colors.primary.DEFAULT} />
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => setIsCreateModalVisible(true)}
                    className="mr-4 h-40 w-40 items-center justify-center rounded-3xl border border-dashed border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
                    <MaterialIcons name="add" size={32} color={Colors.text.secondary.light} />
                    <Text className="mt-2 text-xs font-medium text-text-secondary-light">
                      Create New
                    </Text>
                  </TouchableOpacity>

                  {collections?.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                      onPress={() =>
                        router.push(
                          `/private/collection?id=${collection.id}&name=${encodeURIComponent(
                            collection.name
                          )}`
                        )
                      }
                    />
                  ))}
                </>
              )}
            </ScrollView>
          </View>

          <View className="mb-3 flex-row items-center justify-between px-6">
            <Text className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
              {Strings.quotes.favorites}
            </Text>
          </View>
          <View className="px-6 pb-8 pt-2">
            {isLoadingFavorites ? (
              <ActivityIndicator size="large" color={Colors.primary.DEFAULT} className="mt-8" />
            ) : favoriteQuotes?.length === 0 ? (
              <Text className="mt-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                No favorites yet. Go explore!
              </Text>
            ) : (
              favoriteQuotes?.map((quote) => (
                <FavoriteQuoteCard
                  key={quote.id}
                  quote={quote}
                  onPress={() => router.push(`/private/quote?id=${quote.id}`)}
                  onFavorite={() => toggleFavorite(quote.id)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <CreateCollectionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateCollection}
      />
    </View>
  );
}
