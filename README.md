# QuoteVault - Golden Hour

A premium, daily quote application built with React Native (Expo) and Supabase.

## Features

- **Daily Inspiration**: "Quote of the Day" that refreshes daily.
- **Browse & Discovery**: Explore quotes by category (Motivation, Love, Wisdom) or search by author/content.
- **Personalization**:
  - Dark/Light mode support.
  - Theme accents (Golden Hour, Noir, Morning Sand).
  - Adjustable font sizes.
- **Collections**: Save favorites and organize them into personal collections.
- **Sharing**: Generate beautiful, shareable quote cards for social media.
- **Cloud Sync**: User profile and settings are synced across devices via Supabase.

## Tech Stack

- **Frontend**: React Native, Expo Router, NativeWind (TailwindCSS).
- **Backend/DB**: Supabase (PostgreSQL, Auth).
- **State Management**: React Context, TanStack Query.
- **Caching**: AsyncStorage.

## Setup Instructions

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd QuoteVault
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (or use `expo-env.d.ts` / `src/lib/supabase.ts` configuration):

    ```
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the app**
    ```bash
    npx expo start -c
    ```

## Project Structure

- `app/`: Expo Router file-based navigation.
- `src/components/`: Reusable UI components.
- `src/context/`: Global state (Auth, Settings).
- `src/hooks/`: Custom hooks for data fetching and logic.
- `src/constants/`: App-wide constants (Colors, Strings).

## License

MIT
