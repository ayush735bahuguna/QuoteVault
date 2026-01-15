import { Colors } from '@/src/constants';
import { useSettings } from '@/src/context';
import { useCollections } from '@/src/hooks/useCollections';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { CreateCollectionModal } from './CreateCollectionModal';

interface AddToCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCollection: (collectionId: string) => Promise<void>;
}

export function AddToCollectionModal({
  visible,
  onClose,
  onSelectCollection,
}: AddToCollectionModalProps) {
  const { isDark } = useSettings();
  const { data: collections, isLoading, createCollection } = useCollections();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSelect = async (id: string) => {
    setLoadingId(id);
    try {
      await onSelectCollection(id);
      onClose();
    } catch (error) {
      console.error('Error adding to collection:', error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCreateCollection = async (name: string, description?: string) => {
    try {
      const newCollection = await createCollection({ name, description });
      if (newCollection) {
        await handleSelect(newCollection.id);
        setShowCreateModal(false); // Close create modal
        // Main modal will be closed by handleSelect
      }
    } catch (error) {
      console.error('Failed to create collection', error);
    }
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="mb-safe-offset-0 flex-1 justify-end bg-black/50">
            <TouchableWithoutFeedback>
              <View className="max-h-[70%] rounded-t-3xl bg-surface-light p-6 dark:bg-surface-dark">
                <View className="mb-6 flex-row items-center justify-between">
                  <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Add to Collection
                  </Text>
                  <TouchableOpacity onPress={onClose}>
                    <MaterialIcons
                      name="close"
                      size={24}
                      color={isDark ? Colors.text.secondary.dark : Colors.text.secondary.light}
                    />
                  </TouchableOpacity>
                </View>

                {isLoading ? (
                  <View className="py-8">
                    <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
                  </View>
                ) : (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity
                      onPress={() => setShowCreateModal(true)}
                      className="mb-4 flex-row items-center rounded-xl border border-dashed border-primary/50 bg-primary/5 p-4">
                      <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <MaterialIcons name="add" size={24} color={Colors.primary.DEFAULT} />
                      </View>
                      <Text className="font-bold text-primary">Create New Collection</Text>
                    </TouchableOpacity>

                    {collections?.map((collection) => (
                      <TouchableOpacity
                        key={collection.id}
                        onPress={() => handleSelect(collection.id)}
                        disabled={!!loadingId}
                        className="mb-3 flex-row items-center rounded-xl border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
                        <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                          <MaterialIcons
                            name="folder-open"
                            size={20}
                            color={isDark ? Colors.text.primary.dark : Colors.text.primary.light}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="font-bold text-text-primary-light dark:text-text-primary-dark">
                            {collection.name}
                          </Text>
                          <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            {collection.quote_count || 0} quotes
                          </Text>
                        </View>
                        {loadingId === collection.id && (
                          <ActivityIndicator size="small" color={Colors.primary.DEFAULT} />
                        )}
                      </TouchableOpacity>
                    ))}

                    {collections?.length === 0 && (
                      <View className="items-center py-8">
                        <Text className="text-text-secondary-light dark:text-text-secondary-dark">
                          No collections found.
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <CreateCollectionModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCollection}
      />
    </>
  );
}
