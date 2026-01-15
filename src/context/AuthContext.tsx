import { User } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';
import { supabase } from '../lib/supabase';
import { AuthState, Profile } from '../types';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, username?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  isPasswordReset: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState['user']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Handle deep links
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink(initialUrl);
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for deep links while app is open
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordReset(true);
      } else if (event === 'SIGNED_OUT') {
        setIsPasswordReset(false);
        setUser(null);
      }

      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, []);

  const handleDeepLink = async (url: string) => {
    // Parse the URL to see if it contains auth tokens
    // Supabase magic links usually look like: scheme://hostname#access_token=...&refresh_token=...&type=recovery
    try {
      // If the URL contains access_token and refresh_token (fragment), we can set the session
      if (url.includes('access_token') && url.includes('refresh_token')) {
        const fragment = url.split('#')[1];
        if (fragment) {
          const params = new URLSearchParams(fragment);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error && type === 'recovery') {
              setIsPasswordReset(true);
            }
          }
        }
      }
    } catch (e) {
      console.log('Error handling deep link:', e);
    }
  };

  const fetchProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      let fetchedProfile = profile;

      // Ensure profile exists. If missing (PGRST116), create one.
      if (error && error.code === 'PGRST116') {
        // Create default profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert({
            id: authUser.id,
            username: authUser.email?.split('@')[0] || 'User',
            font_size: 'medium',
            theme: 'goldenHour',
            notification_time: '09:00',
            notifications_enabled: true,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating missing profile:', createError);
        } else {
          fetchedProfile = newProfile;
        }
      } else if (error) {
        console.error('Error fetching profile:', error);
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        profile: fetchedProfile || undefined,
      });
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error };

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          username: username || email.split('@')[0],
          font_size: 'medium',
          theme: 'goldenHour',
          notification_time: '09:00',
          notifications_enabled: true,
        });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsPasswordReset(false);
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (!error) {
        await refreshProfile();
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const refreshProfile = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      await fetchProfile(authUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isPasswordReset,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        refreshProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
