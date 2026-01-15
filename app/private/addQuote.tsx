import { Colors, Strings } from '@/src/constants';
import { useAuth, useSettings } from '@/src/context';
import { useCategories } from '@/src/hooks/useCategories';
import { supabase } from '@/src/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function addQuote() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useSettings();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const [content, setContent] = useState('');

  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Default to empty, user selects

  // Set default category when loaded if not set
  React.useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert(Strings.addQuote.errorTitle, Strings.addQuote.validationContent);
      return;
    }

    setIsSubmitting(true);
    Keyboard.dismiss();

    try {
      if (!user) {
        throw new Error(Strings.addQuote.loginRequired);
      }

      const { error } = await supabase.from('quotes').insert({
        content: content.trim(),
        author: user?.profile?.username || 'Anonymous',
        category_id: selectedCategory,
        // user_id: user.id, // Removed as column doesn't exist
        // background_image: null, // Optional for now
      });

      if (error) throw error;

      Alert.alert(Strings.addQuote.successTitle, Strings.addQuote.successMessage, [
        {
          text: Strings.actions.done, // Assuming done exists in actions
          onPress: () => {
            setContent('');
            router.replace('/private/(tabs)');
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding quote:', error);
      Alert.alert(Strings.addQuote.errorTitle, Strings.errors.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1 px-6 pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header */}
            <View className="mb-8 flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {Strings.addQuote.headerTitle}
                </Text>
                <Text className="text-text-secondary-light dark:text-text-secondary-dark">
                  {Strings.addQuote.headerSubtitle}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.back()}
                className="rounded-full bg-surface-light p-2 shadow-sm dark:bg-surface-dark">
                <MaterialIcons
                  name="close"
                  size={24}
                  color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
                />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View className="gap-6">
              {/* Quote Content */}
              <View>
                <Text className="mb-2 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {Strings.addQuote.contentLabel}
                </Text>
                <View className="min-h-[160px] rounded-2xl border border-border-light bg-surface-light p-4 dark:border-white/10 dark:bg-surface-dark">
                  <TextInput
                    className="flex-1 font-serif text-lg leading-relaxed text-text-primary-light dark:text-text-primary-dark"
                    placeholder={Strings.addQuote.contentPlaceholder}
                    placeholderTextColor={
                      isDark ? Colors.text.secondary.dark : Colors.text.secondary.light
                    }
                    multiline
                    value={content}
                    onChangeText={setContent}
                    textAlignVertical="top"
                    style={{ minHeight: 120 }}
                  />
                </View>
              </View>

              {/* Category */}
              <View>
                <Text className="mb-3 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {Strings.addQuote.categoryLabel}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="-mx-6 px-6">
                  <View className="flex-row gap-3">
                    {isLoadingCategories ? (
                      <ActivityIndicator
                        color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
                      />
                    ) : categories?.length === 0 ? (
                      <Text className="text-text-secondary-light dark:text-text-secondary-dark">
                        No categories available.
                      </Text>
                    ) : (
                      categories?.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          onPress={() => setSelectedCategory(category.id)}
                          className={`rounded-full border px-5 py-2.5 ${
                            selectedCategory === category.id
                              ? 'border-primary bg-primary'
                              : 'border-border-light bg-surface-light dark:border-white/10 dark:bg-surface-dark'
                          }`}>
                          <Text
                            className={`font-medium ${
                              selectedCategory === category.id
                                ? 'text-white'
                                : 'text-text-secondary-light dark:text-text-secondary-dark'
                            }`}>
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </ScrollView>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                className={`mt-6 h-14 w-full flex-row items-center justify-center rounded-xl bg-primary shadow-lg ${
                  isSubmitting ? 'opacity-70' : ''
                }`}
                style={{ shadowColor: Colors.primary.DEFAULT, shadowOpacity: 0.3 }}>
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <MaterialIcons name="add" size={24} color="white" />
                    <Text className="ml-2 text-lg font-bold text-white">
                      {Strings.addQuote.submitButton}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
