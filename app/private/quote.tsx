import { AddToCollectionModal } from '@/src/components/AddToCollectionModal';
import { Colors, Strings } from '@/src/constants';
import { useSettings } from '@/src/context';
import { useFavorites } from '@/src/hooks/useFavorites';
import { useQuote } from '@/src/hooks/useQuote';
import { supabase } from '@/src/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function QuoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark, getFontSizeValue } = useSettings();
  const insets = useSafeAreaInsets();

  const { data: quote, isLoading, error } = useQuote(id || '');
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorited = quote ? favoriteIds.has(quote.id) : false;

  const [isCollectionModalVisible, setIsCollectionModalVisible] = React.useState(false);

  const handleCopy = async () => {
    if (quote) {
      await Clipboard.setStringAsync(`"${quote.content}" — ${quote.author}`);
    }
  };

  const handleFavorite = async () => {
    if (quote) {
      await toggleFavorite(quote.id);
    }
  };

  const handleAssignToCollection = async (collectionId: string) => {
    // Check for duplicate
    const { data: existing } = await supabase
      .from('collection_items')
      .select('id')
      .eq('collection_id', collectionId)
      .eq('quote_id', id)
      .single();

    if (existing) {
      alert('This quote is already in the collection');
      return;
    }

    const { error } = await supabase.from('collection_items').insert({
      collection_id: collectionId,
      quote_id: id,
    });

    if (error) {
      console.error('Failed to add to collection', error);
      alert('Failed to add quote to collection');
    } else {
      alert('Quote added to collection!');
      setIsCollectionModalVisible(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  if (error || !quote) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <Text className="text-lg font-medium text-text-secondary-light dark:text-text-secondary-dark">
          Quote not found.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 rounded-full bg-primary px-6 py-3 shadow-md">
          <Text className="font-bold text-white">Return Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Dynamic gradient based on theme
  const gradientColors = isDark
    ? [Colors.background.dark, '#2D2420', '#1F1A17']
    : [Colors.background.light, '#FDF6E3', '#FFF9F0'];

  // Dynamic font sizing - responsive to screen width
  const baseFontSize = (getFontSizeValue ? getFontSizeValue() : 16) + 8;
  const responsiveFontSize = Math.min(baseFontSize, width * 0.08); // Cap at 8% of screen width

  return (
    <View className="flex-1">
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}>
        {/* Transparent Header */}
        <View
          className="absolute left-0 right-0 z-10 flex-row items-center justify-between px-6"
          style={{ top: insets.top + 10 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface-light/80 shadow-sm backdrop-blur-md dark:bg-surface-dark/80">
            <MaterialIcons name="arrow-back" size={24} color={Colors.text.primary.light} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingBottom: 160,
            paddingTop: 80,
          }}
          showsVerticalScrollIndicator={false}>
          <View className="mb-10 w-full items-center px-8">
            {/* Category Pill */}
            <View className="mb-10 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 backdrop-blur-sm">
              <Text className="text-xs font-bold uppercase tracking-widest text-primary">
                {quote.category?.name || 'Inspiration'}
              </Text>
            </View>

            {/* Main Quote Card */}
            <View className="relative w-full">
              {/* Decorative Quote Mark */}
              <View className="absolute -left-6 -top-12 z-0 opacity-10">
                <MaterialIcons name="format-quote" size={120} color={Colors.primary.DEFAULT} />
              </View>

              <Text
                className="text-center font-serif font-medium leading-relaxed text-text-primary-light shadow-sm dark:text-text-primary-dark"
                style={{
                  fontSize: responsiveFontSize,
                  lineHeight: responsiveFontSize * 1.5,
                  textShadowColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 4,
                }}>
                {quote.content}
              </Text>
            </View>

            {/* Divider */}
            <View className="my-10 h-[1px] w-16 bg-primary/30" />

            {/* Author Section */}
            <View className="items-center">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-full border border-primary/10 bg-surface-light shadow-md dark:bg-surface-dark">
                <Text className="font-serif text-xl font-bold text-primary">
                  {quote.author.charAt(0)}
                </Text>
              </View>
              <Text className="mb-0.5 text-sm tracking-wide text-text-primary-light dark:text-text-primary-dark">
                {quote.author}
              </Text>
              {quote.author_title && (
                <Text className="text-xs font-medium uppercase tracking-wider text-text-secondary-light opacity-80 dark:text-text-secondary-dark">
                  {quote.author_title}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions Floating Bar */}
        <View
          className="absolute bottom-10 left-0 right-0 items-center px-6"
          style={{ paddingBottom: insets.bottom }}>
          <View className="flex-row items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/80 px-6 py-4 shadow-xl backdrop-blur-xl dark:bg-black/20">
            {/* Add to Collection */}
            <TouchableOpacity
              className="items-center"
              onPress={() => setIsCollectionModalVisible(true)}>
              <MaterialIcons name="playlist-add" size={26} color={isDark ? '#E6DACE' : '#3E2723'} />
              <Text className="mt-1 text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark">
                {Strings.actions.save || 'Save'}
              </Text>
            </TouchableOpacity>

            <View className="h-8 w-[1px] bg-white/20" />

            <TouchableOpacity className="items-center" onPress={handleCopy}>
              <MaterialIcons name="content-copy" size={26} color={isDark ? '#E6DACE' : '#3E2723'} />
              <Text className="mt-1 text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark">
                {Strings.actions.copy}
              </Text>
            </TouchableOpacity>

            <View className="h-8 w-[1px] bg-white/20" />

            <TouchableOpacity
              onPress={() => router.push(`/private/customize?id=${quote.id}`)}
              className="items-center">
              <MaterialIcons name="ios-share" size={26} color={isDark ? '#E6DACE' : '#3E2723'} />
              <Text className="mt-1 text-[10px] font-bold text-text-primary-light dark:text-text-primary-dark">
                {Strings.actions.share}
              </Text>
            </TouchableOpacity>

            <View className="h-8 w-[1px] bg-white/20" />

            <TouchableOpacity className="items-center" onPress={handleFavorite}>
              <MaterialIcons
                name={isFavorited ? 'favorite' : 'favorite-border'}
                size={26}
                color={isFavorited ? '#EF4444' : isDark ? '#E6DACE' : '#3E2723'}
              />
              <Text className="mt-1 text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark">
                {isFavorited ? 'Liked' : 'Like'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <AddToCollectionModal
          visible={isCollectionModalVisible}
          onClose={() => setIsCollectionModalVisible(false)}
          onSelectCollection={handleAssignToCollection}
        />
      </LinearGradient>
    </View>
  );
}
