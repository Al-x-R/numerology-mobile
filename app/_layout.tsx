// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { EBGaramond_500Medium, EBGaramond_500Medium_Italic, EBGaramond_600SemiBold } from '@expo-google-fonts/eb-garamond';
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useEffect } from 'react';

import { COLORS } from '@/lib/constants/theme';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { AuraBackground } from '@/components/ui/AuraBackground';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    EBGaramond_500Medium,
    EBGaramond_500Medium_Italic,
    EBGaramond_600SemiBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
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
        <NotificationsProvider>
          <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <View style={styles.root}>
              <AuraBackground />
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
        </NotificationsProvider>
      </LanguageProvider>
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  navigation: {
    flex: 1,
    backgroundColor: COLORS.transparent,
  },
});
