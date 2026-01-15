import { supabase } from '@/src/lib/supabase';
import { Category } from '@/src/types';
import { useQuery } from '@tanstack/react-query';

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');

      if (error) throw error;

      return data as Category[];
    },
  });
};
