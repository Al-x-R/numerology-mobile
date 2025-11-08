// app/index.tsx
import { Href, useRouter } from 'expo-router';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useEffect, useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';

export default function InitialLoadScreen() {
  const router = useRouter();
  const { user, isLoading } = useProfile();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (ready && !isLoading) {
      const targetRoute: Href = user ? '/(tabs)/profiles' : '/(auth)/onboarding';
      router.replace(targetRoute);
    }
  }, [ready, isLoading, user, router]);

  if (!ready || isLoading) {
    return <LoadingScreen />;
  }

  return null;
}
