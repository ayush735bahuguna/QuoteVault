import { requireNativeModule } from 'expo-modules-core';

const WidgetModule = requireNativeModule('WidgetModule');

export function setQuote(quote: string, author: string): boolean {
  return WidgetModule.setQuote(quote, author);
}

export function getQuote(): { quote: string; author: string } {
  return WidgetModule.getQuote();
}
