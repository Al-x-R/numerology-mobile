// app/index.tsx
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useAppFonts } from '@/hooks/useFonts';

SplashScreen.preventAutoHideAsync();

export default function InitialLoadScreen() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded, fontError] = useAppFonts();

  useEffect(() => {
    async function prepare() {
      try {
        if (!fontsLoaded) return;

        await new Promise(resolve => setTimeout(resolve, 800));

      } catch (e) {
        console.warn('Prepare error:', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    if (fontsLoaded || fontError) {
      prepare();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (fontError) {
    return <LoadingScreen />;
  }

  if (isReady) {
    return <Redirect href="/pythagoras" />;
  }

  return <LoadingScreen />;
}
