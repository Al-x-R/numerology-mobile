// app/index.tsx
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';

SplashScreen.preventAutoHideAsync();

export default function InitialLoadScreen() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Загрузи шрифты, кэш, API
        // await Font.loadAsync(...);
        // await initializeApp();
        await new Promise(r => setTimeout(r, 1500)); // имитация
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return <Redirect href="/pythagoras" />;
}
