import { supabase } from '@/src/lib/supabase';
import { Quote } from '@/src/types';
import { useQuery } from '@tanstack/react-query';

export const useQuote = (id: string) => {
  return useQuery<Quote, Error>({
    queryKey: ['quote', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(
          `
          *,
          category:categories(name)
        `
        )
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as Quote;
    },
    enabled: !!id,
  });
};
