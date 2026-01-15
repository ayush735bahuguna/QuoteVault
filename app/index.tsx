import { useAuth } from '@/src/context';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/private/(tabs)" />;
  }

  return <Redirect href="/auth/login" />;
}
