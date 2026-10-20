// app/profile/_layout.tsx
import { router, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/lib/constants/theme';
import { BackButton } from '@/components/ui/BackButton';
import React from 'react';
import { useAppTranslation } from '@/contexts/LanguageContext';

const renderBackButton = () => (
  <BackButton onPress={() => router.back()} iconColor={COLORS.textTertiary} style={styles.backButton} />
);

export default function ProfileLayout() {
  const { t } = useAppTranslation();

  return (
    <Stack
      screenOptions={{
        presentation: 'card',
        headerStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        headerTitleStyle: FONTS.headerTitle,
        headerTintColor: COLORS.text,
        headerTitleAlign: 'center',
        headerLeft: renderBackButton,
        // iOS 26+ draws a shared glass capsule behind header buttons; the button has its own background
        unstable_headerLeftItems: () => [{ type: 'custom', element: renderBackButton(), hidesSharedBackground: true }],
      }}
    >
      <Stack.Screen name="index" options={{ title: t('profile.title').toUpperCase() }} />
      <Stack.Screen name="edit" options={{ title: t('profile.editProfile').toUpperCase() }} />
      <Stack.Screen name="notifications" options={{ title: t('notifications.title').toUpperCase() }} />
      <Stack.Screen name="language/index" options={{ title: t('profile.changeLanguage').toUpperCase() }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: { backgroundColor: COLORS.surfaceRaised, borderWidth: 1, borderColor: COLORS.hairline },
});
