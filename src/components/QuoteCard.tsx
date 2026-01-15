import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/src/constants';
import { useSettings } from '@/src/context';
import { Quote } from '@/src/types';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export function QuoteCard({
  quote,
  onPress,
  onFavorite,
  isFavorited,
}: {
  quote: Quote;
  onPress: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
}) {
  const { isDark } = useSettings();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(`"${quote.content}" — ${quote.author}`);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      className="mb-4 rounded-2xl border border-border-light bg-card p-6 shadow-soft dark:border-border-dark dark:bg-surface-dark">
      {/* Category Badge */}
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-row items-center">
          <View className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
          <Text className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
            {quote.category?.name || 'Quote'}
          </Text>
        </View>
        <TouchableOpacity onPress={onFavorite} className="p-1">
          <MaterialIcons
            name={isFavorited ? 'favorite' : 'favorite-border'}
            size={22}
            color={isFavorited ? Colors.primary.DEFAULT : Colors.text.secondary.light}
          />
        </TouchableOpacity>
      </View>

      {/* Quote Content */}
      <Text className="mb-4 font-serif text-2xl leading-relaxed text-text-primary-light dark:text-text-primary-dark">
        {quote.content}
      </Text>

      {/* Author Section */}
      <View className="flex-row items-center justify-between border-t border-border-light pt-4 dark:border-border-dark">
        <View className="flex-row items-center">
          {quote.author_image ? (
            <Image source={{ uri: quote.author_image }} className="mr-3 h-8 w-8 rounded-full" />
          ) : (
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-secondary/30">
              <Text className="text-xs font-bold text-text-secondary-light">
                {quote.author.charAt(0)}
              </Text>
            </View>
          )}
          <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
            {quote.author}
          </Text>
        </View>

        <View className="flex-row">
          <TouchableOpacity className="p-2" onPress={handleCopy}>
            <MaterialIcons name="content-copy" size={18} color={Colors.text.secondary.light} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <MaterialIcons name="ios-share" size={18} color={Colors.text.secondary.light} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
