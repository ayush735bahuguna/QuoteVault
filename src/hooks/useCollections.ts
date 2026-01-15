import { supabase } from '@/src/lib/supabase';
import { Collection } from '@/src/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/context';

export const useCollections = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch collections
  const query = useQuery<Collection[], Error>({
    queryKey: ['collections', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as Collection[];
    },
    enabled: !!user?.id,
  });

  // Create collection mutation
  const createMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('collections')
        .insert({
          name,
          description,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.id] });
    },
  });

  return { ...query, createCollection: createMutation.mutateAsync };
};
