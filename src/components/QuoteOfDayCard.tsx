import { Strings } from '@/src/constants';
import { useSettings } from '@/src/context'; // Add import
import { Quote } from '@/src/types';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Add import
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function QuoteOfDayCard({ quote }: { quote: Quote | null }) {
  const router = useRouter();
  const { colors, currentTheme } = useSettings(); // Use context

  if (!quote) return null;

  const handleShare = () => {
    router.push(`/private/customize?id=${quote.id}`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => router.push(`/private/quote?id=${quote.id}`)}
      className="mx-6 mb-6 overflow-hidden rounded-2xl shadow-lg">
      <View className="relative min-h-80" style={{ backgroundColor: colors.primary.DEFAULT }}>
        {/* Gradient Overlay using Theme Gradient */}
        <LinearGradient
          colors={currentTheme.gradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0.9 }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />

        {/* Content */}
        <View className="flex-1 justify-between p-6 pt-8">
          {/* Header */}
          <View className="mb-4 flex-row items-center">
            <MaterialIcons name="wb-sunny" size={18} color="rgba(255,255,255,0.9)" />
            <Text className="ml-2 text-xs font-bold uppercase tracking-widest text-white/90">
              {Strings.quotes.quoteOfDay}
            </Text>
          </View>

          {/* Quote */}
          <View className="mb-8">
            <Text className="absolute -left-3 -top-4 font-serif text-6xl text-white/20">"</Text>
            <Text className="font-serif text-3xl font-medium leading-tight text-white">
              {quote.content}
            </Text>
          </View>

          {/* Author */}
          <View className="flex-row items-end justify-between border-t border-white/20 pt-4">
            <View>
              <Text className="text-lg font-bold text-white">{quote.author}</Text>
              {quote.author_title && (
                <Text className="text-sm text-white/80">{quote.author_title}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleShare}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <MaterialIcons name="share" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
