// Database Types

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  font_size: "small" | "medium" | "large";
  theme: "goldenHour" | "noir" | "classic";
  notification_time: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  created_at: string;
}

export interface Quote {
  id: string;
  content: string;
  author: string;
  author_title?: string;
  author_image?: string;
  category_id: string;
  category?: Category;
  image_url?: string;
  is_quote_of_day: boolean;
  quote_of_day_date: string | null;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  quote_id: string;
  quote?: Quote;
  created_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image?: string;
  quote_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  quote_id: string;
  quote?: Quote;
  created_at: string;
}

export interface QuoteOfDay {
  id: string;
  quote_id: string;
  quote?: Quote;
  date: string;
  created_at: string;
}

// UI Types

export type ThemeMode = "light" | "dark" | "system";
export type FontSize = "small" | "medium" | "large";
export type ThemeName = "goldenHour" | "noir" | "classic";

export interface ShareCardStyle {
  id: string;
  name: string;
  type: "classic" | "nature" | "warm" | "noir" | "fluid";
  background:
    | string
    | { type: "gradient"; colors: string[] }
    | { type: "image"; url: string };
}

// Auth Types

export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Settings Types

export interface Settings {
  themeMode: ThemeMode;
  themeName: ThemeName;
  fontSize: FontSize;
  notificationsEnabled: boolean;
  notificationTime: string;
}
