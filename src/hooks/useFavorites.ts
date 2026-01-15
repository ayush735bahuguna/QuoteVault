import { supabase } from '@/src/lib/supabase';
import { Favorite, Quote } from '@/src/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/context';

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch favorited quote IDs for quick lookup
  // Store as Array for proper JSON serialization/persistence
  const query = useQuery<string[], Error>({
    queryKey: ['favorites', 'ids', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select('quote_id')
        .eq('user_id', user.id);

      if (error) throw error;

      return data.map((f) => f.quote_id);
    },
    enabled: !!user?.id,
  });

  // Fetch full favorited quotes
  const quotesQuery = useQuery<Quote[], Error>({
    queryKey: ['favorites', 'list', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select(
          `
          quote_id,
          quote:quotes (
            *,
            category:categories(name)
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Extract the nested quote objects
      return data.map((item) => item.quote) as unknown as Quote[];
    },
    enabled: !!user?.id,
  });

  // Toggle favorite mutation with Optimistic Update
  const toggleMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      // ... existing mutation logic ...
      if (!user?.id) throw new Error('User not authenticated');

      // Use the derived Set for the check logic
      const currentData = Array.isArray(query.data) ? query.data : [];
      const isFavorited = new Set(currentData).has(quoteId);

      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('quote_id', quoteId);
        if (error) throw error;
        return { action: 'removed', quoteId };
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, quote_id: quoteId });
        if (error) throw error;
        return { action: 'added', quoteId };
      }
    },
    onMutate: async (quoteId) => {
      // Cancel refetches
      await queryClient.cancelQueries({ queryKey: ['favorites', 'ids', user?.id] });

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData<string[]>(['favorites', 'ids', user?.id]);

      // Optimistically update
      queryClient.setQueryData<string[]>(['favorites', 'ids', user?.id], (old) => {
        const oldArray = Array.isArray(old) ? old : [];
        const exists = oldArray.includes(quoteId);

        if (exists) {
          return oldArray.filter((id) => id !== quoteId);
        } else {
          return [...oldArray, quoteId];
        }
      });

      return { previousFavorites };
    },
    onError: (err, quoteId, context) => {
      // Rollback
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites', 'ids', user?.id], context.previousFavorites);
      }
    },
    onSettled: () => {
      // Refetch to sync
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  return {
    favoriteIds: new Set(Array.isArray(query.data) ? query.data : []),
    favoriteQuotes: quotesQuery.data || [],
    isLoading: query.isLoading || quotesQuery.isLoading,
    toggleFavorite: toggleMutation.mutateAsync,
  };
};
