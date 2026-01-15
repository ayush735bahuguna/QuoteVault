import { supabase } from '@/src/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export interface Author {
  id: string;
  name: string;
  quoteCount: number;
}

export const useAuthors = () => {
  return useQuery<Author[], Error>({
    queryKey: ['authors'],
    queryFn: async () => {
      // Fetch authors from quotes
      // Note: In a real production app with millions of rows, we should have a separate authors table
      // or an RPC/View for this aggregation. For now, client-side aggregation is acceptable.
      const { data, error } = await supabase.from('quotes').select('author');

      if (error) throw error;

      // Aggregate authors and count quotes
      const authorMap = new Map<string, number>();

      data.forEach((item) => {
        if (item.author) {
          const count = authorMap.get(item.author) || 0;
          authorMap.set(item.author, count + 1);
        }
      });

      // Convert to array and sort by count (descending)
      const authors: Author[] = Array.from(authorMap.entries())
        .map(([name, count], index) => ({
          id: `author-${index}`,
          name,
          quoteCount: count,
        }))
        .sort((a, b) => b.quoteCount - a.quoteCount)
        .slice(0, 10); // Return top 10

      return authors;
    },
  });
};
