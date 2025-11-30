// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import LOGO_IMAGE from '../assets/images/NumericalCompass.png';
import { COLORS, LAYOUT } from '@/lib/constants/theme';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'PlayfairDisplay-Regular': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'Manrope-Bold': require('../assets/fonts/Manrope-Bold.ttf'),
    'Manrope-Regular': require('../assets/fonts/Manrope-Regular.ttf'),
    'Cinzel-Regular': require('../assets/fonts/Cinzel-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ProfileProvider>
      <LanguageProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
          <View style={styles.root}>
            <View style={styles.background}>
              <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
            </View>
            <View style={styles.navigation}>
              <Stack
                screenOptions={{
                  contentStyle: { backgroundColor: 'transparent' },
                  headerStyle: { backgroundColor: 'transparent' },
                  headerShadowVisible: false,
                }}
              >
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="premium/upgrade"
                  options={{
                    presentation: 'fullScreenModal',
                    headerShown: false,
                    gestureEnabled: true
                  }}
                />
                <Stack.Screen name="profile" options={{ headerShown: false }} />
              </Stack>
            </View>
          </View>
        </SafeAreaProvider>
      </LanguageProvider>
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  background: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    maxWidth: LAYOUT.logoMedium,
    maxHeight: LAYOUT.logoMedium,
    opacity: 1,
  },
  navigation: {
    flex: 1,
    backgroundColor: COLORS.transparent,
  },
  restartContainer: {
    flex: 1,
    backgroundColor: '#0F0A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
