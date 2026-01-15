import { Colors, Strings } from '@/src/constants';
import { useSettings } from '@/src/context';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface CreateCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => Promise<void>;
}

export function CreateCollectionModal({ visible, onClose, onSubmit }: CreateCollectionModalProps) {
  const { isDark } = useSettings();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(name, description);
      setName('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/50 p-6">
          <TouchableWithoutFeedback>
            <View className="w-full max-w-sm rounded-3xl bg-surface-light p-6 shadow-xl dark:bg-surface-dark">
              <View className="mb-6 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  New Collection
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <MaterialIcons
                    name="close"
                    size={24}
                    color={isDark ? Colors.text.secondary.dark : Colors.text.secondary.light}
                  />
                </TouchableOpacity>
              </View>

              <View className="gap-4">
                <View>
                  <Text className="mb-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    Name
                  </Text>
                  <TextInput
                    className="rounded-xl border border-border-light bg-background-light px-4 py-3 text-text-primary-light dark:border-border-dark dark:bg-background-dark dark:text-text-primary-dark"
                    placeholder="e.g. Morning Motivation"
                    placeholderTextColor={
                      isDark ? Colors.text.secondary.dark : Colors.text.secondary.light
                    }
                    value={name}
                    onChangeText={setName}
                    autoFocus
                  />
                </View>

                <View>
                  <Text className="mb-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    Description (Optional)
                  </Text>
                  <TextInput
                    className="rounded-xl border border-border-light bg-background-light px-4 py-3 text-text-primary-light dark:border-border-dark dark:bg-background-dark dark:text-text-primary-dark"
                    placeholder="What's this collection about?"
                    placeholderTextColor={
                      isDark ? Colors.text.secondary.dark : Colors.text.secondary.light
                    }
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!name.trim() || isSubmitting}
                  className={`mt-4 flex-row items-center justify-center rounded-xl py-3 ${
                    !name.trim() || isSubmitting ? 'bg-primary/50' : 'bg-primary'
                  }`}>
                  {isSubmitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="font-bold text-white">Create Collection</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
