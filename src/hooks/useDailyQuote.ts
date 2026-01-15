import { supabase } from '@/src/lib/supabase';
import { Quote } from '@/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

const DAILY_QUOTE_KEY = '@quotevault_daily_quote';
const DAILY_QUOTE_DATE_KEY = '@quotevault_daily_quote_date';

export const useDailyQuote = () => {
  return useQuery({
    queryKey: ['dailyQuote'],
    queryFn: async () => {
      const today = new Date().toDateString();

      // 1. Check local cache
      const cachedDate = await AsyncStorage.getItem(DAILY_QUOTE_DATE_KEY);
      const cachedQuoteStr = await AsyncStorage.getItem(DAILY_QUOTE_KEY);

      if (cachedDate === today && cachedQuoteStr) {
        return JSON.parse(cachedQuoteStr) as Quote;
      }

      // 2. Fetch new random quote from Supabase
      // Since we don't have a specific 'random' endpoint function, we'll fetch a batch and pick one.
      // A better way for large DBs is using a stored procedure, but for <1000 items this is fine.
      const { data, error } = await supabase
        .from('quotes')
        .select(`*, category:categories(name)`)
        .limit(20); // Fetch a small batch

      if (error) throw error;
      if (!data || data.length === 0) return null;

      // Simple random pick
      const randomIndex = Math.floor(Math.random() * data.length);
      const newDailyQuote = data[randomIndex];

      // 3. Cache it
      await AsyncStorage.setItem(DAILY_QUOTE_KEY, JSON.stringify(newDailyQuote));
      await AsyncStorage.setItem(DAILY_QUOTE_DATE_KEY, today);

      return newDailyQuote as Quote;
    },
    staleTime: 1000 * 60 * 60, // 1 hour (check periodically but rely on date logic)
  });
};
