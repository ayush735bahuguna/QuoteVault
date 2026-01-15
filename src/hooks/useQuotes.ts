import { supabase } from '@/src/lib/supabase';
import { Quote } from '@/src/types';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_SIZE = 20;

export const useQuotes = (categoryId?: string, searchQuery?: string) => {
  return useInfiniteQuery({
    queryKey: ['quotes', categoryId, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('quotes')
        .select(`*, category:categories(name)`)
        .order('created_at', { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }

      if (searchQuery) {
        query = query.or(`content.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Quote[];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) {
        return undefined; // No more pages
      }
      return allPages.length; // Next page index
    },
    initialPageParam: 0,
  });
};
