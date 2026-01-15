import { supabase } from '@/src/lib/supabase';
import { Quote } from '@/src/types';
import { useQuery } from '@tanstack/react-query';

export const useCollectionQuotes = (collectionId: string) => {
  return useQuery<Quote[], Error>({
    queryKey: ['collection_items', collectionId],
    queryFn: async () => {
      if (!collectionId) throw new Error('Collection ID is required');

      // Fetch quotes that are linked to this collection
      // We are selecting from 'collection_items' and expanding the related 'quote' data
      const { data, error } = await supabase
        .from('collection_items')
        .select(
          `
          quote_id,
          quotes (
            id,
            content,
            author,
            author_image,
            category:categories(name)
          )
        `
        )
        .eq('collection_id', collectionId);

      if (error) throw error;

      // Extract the nested quote objects and map them to the Quote type
      // Note: Data is an array of objects like { quote_id: '...', quotes: { ... } }
      // We filter out any null quotes just in case integrity was lost
      const quotes = data
        ?.map((item: any) => item.quotes)
        .filter((quote: any) => quote !== null) as Quote[];

      return quotes || [];
    },
    enabled: !!collectionId,
  });
};
