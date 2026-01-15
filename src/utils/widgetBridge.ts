import { Platform } from 'react-native';
import { setQuote } from '../../modules/widget-module/src';

/**
 * Updates the home screen widget with the daily quote.
 * Only works on Android. On iOS, this is a no-op.
 */
export async function updateWidget(quote: string, author: string): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    setQuote(quote, author);
    return true;
  } catch {
    return false;
  }
}
