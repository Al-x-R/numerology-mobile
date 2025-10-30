//app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Image, StatusBar } from 'react-native';

import LOGO_IMAGE from '../assets/images/NumericalCompass.png';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0F21',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    maxWidth: 600,
    maxHeight: 600,
    opacity: 1,
  },
  navigation: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0D0F21" />
      <View style={styles.root}>
        {/* Background with logo */}
        <View style={styles.background}>
          <Image
            source={LOGO_IMAGE}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        {/* Navigation over the background */}
        <View style={styles.navigation}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: 'transparent' },
              headerStyle: { backgroundColor: 'transparent' },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
