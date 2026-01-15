import { Colors, Strings } from '@/src/constants';
import { useSettings } from '@/src/context';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuote } from '@/src/hooks/useQuote';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  Modal,
  ScrollView,
  Share,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';

const { width } = Dimensions.get('window');

interface ThemeBackgroundProps {
  theme: (typeof THEME_STYLES)[0];
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ThemeBackground = ({ theme, children, style }: ThemeBackgroundProps) => {
  if (theme.type === 'image') {
    return (
      <ImageBackground source={{ uri: theme.imageUrl }} style={style} resizeMode="cover">
        {children}
      </ImageBackground>
    );
  }
  if (theme.type === 'gradient') {
    return (
      <LinearGradient
        colors={theme.colors as any}
        style={style}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        {children}
      </LinearGradient>
    );
  }
  return <View style={[style, { backgroundColor: theme.background }]}>{children}</View>;
};

// Theme styles for shareable cards
const THEME_STYLES = [
  {
    id: 'classic',
    name: 'Classic',
    type: 'solid',
    background: '#FFFFFF',
    textColor: '#2C2420',
  },
  {
    id: 'nature',
    name: 'Nature',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    textColor: '#FFFFFF',
  },
  {
    id: 'warm',
    name: 'Warm',
    type: 'gradient',
    colors: ['#FED7AA', '#FCA5A5'],
    textColor: '#7C2D12',
  },
  {
    id: 'noir',
    name: 'Noir',
    type: 'solid',
    background: '#16181D',
    textColor: '#FFFFFF',
  },
  {
    id: 'fluid',
    name: 'Fluid',
    type: 'gradient',
    colors: ['#134E5E', '#71B280'],
    textColor: '#FFFFFF',
  },
];

export default function CustomizeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useSettings();
  const viewShotRef = useRef<ViewShot>(null);
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedTheme, setSelectedTheme] = useState('nature');
  const [fontSize, setFontSize] = useState(24);

  const { data: quote, isLoading } = useQuote(id || '');

  const currentTheme = THEME_STYLES.find((t) => t.id === selectedTheme) || THEME_STYLES[1];

  const [status, requestPermission] = MediaLibrary.usePermissions();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  if (!quote) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <Text className="text-text-secondary-light dark:text-text-secondary-dark">
          Quote not found
        </Text>
      </View>
    );
  }

  const handleSaveImage = async () => {
    try {
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();

        if (!status?.granted) {
          const permission = await requestPermission();
          if (!permission.granted) {
            Alert.alert('Permission needed', 'Please allow access to save images to your gallery.');
            return;
          }
        }

        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Saved!', 'Quote saved to your gallery.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const handleCopyText = async () => {
    if (quote) {
      await Clipboard.setStringAsync(`"${quote.content}" — ${quote.author}`);
      Alert.alert('Copied!', 'Quote copied to clipboard');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${quote.content}" - ${quote.author}\n\nShared via QuoteVault`,
      });
    } catch (error) {
      // Share failed
    }
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
      <View className="items-center justify-center p-6">
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 1 }}
          style={{
            width: width - 48,
            aspectRatio: 4 / 5,
            borderRadius: 16,
            overflow: 'hidden',
          }}>
          <ThemeBackground
            theme={currentTheme}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            {/* Dark overlay for image backgrounds */}
            {currentTheme.type === 'image' && <View className="absolute inset-0 bg-black/30" />}

            {/* Quote Icon */}
            <MaterialIcons
              name="format-quote"
              size={36}
              color={currentTheme.textColor}
              style={{ opacity: 0.8, marginBottom: 24 }}
            />

            {/* Quote Text */}
            <Text
              className="mb-6 text-center font-serif leading-relaxed"
              style={{
                color: currentTheme.textColor,
                fontSize,
              }}>
              "{quote.content}"
            </Text>

            {/* Divider */}
            <View
              className="mb-6 h-0.5 w-12 rounded-full"
              style={{ backgroundColor: currentTheme.textColor, opacity: 0.6 }}
            />

            {/* Author */}
            <Text
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: currentTheme.textColor }}>
              {quote.author}
            </Text>

            {/* Watermark */}
            <View className="absolute bottom-6 flex-row items-center opacity-60">
              <MaterialIcons name="bookmark" size={16} color={currentTheme.textColor} />
              <Text
                className="ml-1.5 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: currentTheme.textColor }}>
                QuoteVault
              </Text>
            </View>
          </ThemeBackground>
        </ViewShot>
      </View>

      <View className="z-10 w-full flex-row flex-wrap justify-center gap-3 px-4">
        <TouchableOpacity
          className="flex-row items-center gap-2 rounded-full border border-border-light bg-surface-light px-4 py-3 shadow-sm dark:border-border-dark dark:bg-surface-dark"
          onPress={handleCopyText}>
          <MaterialIcons
            name="content-copy"
            size={20}
            color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
          />
          <Text className="font-bold text-text-primary-light dark:text-text-primary-dark">
            Copy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center gap-2 rounded-full border border-border-light bg-surface-light px-4 py-3 shadow-sm dark:border-border-dark dark:bg-surface-dark"
          onPress={handleSaveImage}>
          <MaterialIcons
            name="download"
            size={20}
            color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
          />
          <Text className="font-bold text-text-primary-light dark:text-text-primary-dark">
            Save
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center gap-2 rounded-full border border-border-light bg-surface-light px-4 py-3 shadow-sm dark:border-border-dark dark:bg-surface-dark"
          onPress={handleShare}>
          <MaterialIcons
            name="share"
            size={20}
            color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
          />
          <Text className="font-bold text-text-primary-light dark:text-text-primary-dark">
            Share
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center gap-2 rounded-full bg-primary px-5 py-3 shadow-lg"
          style={{
            shadowColor: Colors.primary.DEFAULT,
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
          onPress={() => setIsModalVisible(true)}>
          <MaterialIcons name="edit" size={20} color="#FFF" />
          <Text className="font-bold text-white">Customize</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}>
        <View className="flex-1 justify-end">
          {/* Backdrop */}
          <TouchableOpacity
            className="absolute inset-0 bg-black/30"
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}
          />

          {/* Controls */}
          <View className="pb-safe-offset-4 rounded-t-3xl border-t border-border-light bg-surface-light px-6 pt-6 shadow-lg dark:border-white/5 dark:bg-surface-dark">
            <View className="mb-6 items-center">
              <View className="h-1 w-12 rounded-full bg-border-light dark:bg-white/20" />
            </View>

            {/* Typography */}
            <View className="mb-6">
              <View className="mb-3 flex-row items-center justify-between px-1">
                <Text className="text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                  {Strings.share.typography}
                </Text>
                <Text className="text-xs font-bold text-primary">{fontSize}px</Text>
              </View>
              <View className="flex-row items-center gap-4 rounded-xl border border-border-light bg-background-light p-3 dark:border-white/5 dark:bg-background-dark/50">
                <MaterialIcons
                  name="text-decrease"
                  size={18}
                  color={Colors.text.secondary.light}
                  onPress={() => setFontSize(Math.max(12, fontSize - 2))}
                />
                <View className="h-1 flex-1 rounded-full bg-border-light dark:bg-border-dark">
                  <View
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${((fontSize - 12) / 24) * 100}%` }}
                  />
                </View>
                <MaterialIcons
                  name="text-increase"
                  size={24}
                  color={Colors.text.secondary.light}
                  onPress={() => setFontSize(Math.min(36, fontSize + 2))}
                />
              </View>
            </View>

            {/* Theme Style */}
            <View className="mb-8">
              <Text className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                {Strings.share.themeStyle}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                {THEME_STYLES.map((theme) => (
                  <TouchableOpacity
                    key={theme.id}
                    onPress={() => setSelectedTheme(theme.id)}
                    className="mr-4 items-center">
                    <View
                      className={`h-16 w-16 overflow-hidden rounded-xl shadow-sm ${
                        selectedTheme === theme.id ? 'border-2 border-primary' : ''
                      }`}>
                      {theme.type === 'image' ? (
                        <ImageBackground
                          source={{ uri: theme.imageUrl }}
                          className="flex-1"
                          resizeMode="cover"
                        />
                      ) : theme.type === 'gradient' ? (
                        <LinearGradient
                          colors={theme.colors || ['#FFFFFF', '#000000']}
                          className="flex-1"
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        />
                      ) : (
                        <View style={{ flex: 1, backgroundColor: theme.background }} />
                      )}

                      {selectedTheme === theme.id && (
                        <View className="absolute inset-0 items-center justify-center bg-black/20">
                          <MaterialIcons name="check" size={18} color="#FFF" />
                        </View>
                      )}
                      {theme.type === 'solid' && (
                        <View className="absolute inset-0 items-center justify-center">
                          <Text
                            className="font-serif text-xs font-bold"
                            style={{ color: theme.textColor }}>
                            Aa
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      className={`mt-2 text-[10px] font-semibold ${
                        selectedTheme === theme.id
                          ? 'text-primary'
                          : 'text-text-secondary-light dark:text-text-secondary-dark'
                      }`}>
                      {theme.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
