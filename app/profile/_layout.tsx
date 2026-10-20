// app/profile/_layout.tsx
import { router, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/lib/constants/theme';
import { BackButton } from '@/components/ui/BackButton';
import React from 'react';
import { useAppTranslation } from '@/contexts/LanguageContext';

export default function ProfileLayout() {
  const { t } = useAppTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t('profile.title').toUpperCase(),
          headerStyle: { backgroundColor: COLORS.background },
          headerShadowVisible: false,
          headerTitleStyle: FONTS.headerTitle,
          headerTintColor: COLORS.text,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <BackButton onPress={() => router.back()} style={styles.headerButton} iconColor={COLORS.accent} />
          ),
        }}
      />

      <Stack.Screen
        name="edit"
        options={{
          title: t('profile.editProfile').toUpperCase(),
          presentation: 'card',
          headerStyle: { backgroundColor: COLORS.background },
          headerShadowVisible: false,
          headerTitleStyle: FONTS.headerTitle,
          headerTintColor: COLORS.text,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <BackButton onPress={() => router.back()} style={styles.headerButton} iconColor={COLORS.accent} />
          ),
        }}
      />

      <Stack.Screen
        name="notifications"
        options={{
          title: t('notifications.title').toUpperCase(),
          presentation: 'card',
          headerStyle: { backgroundColor: COLORS.background },
          headerShadowVisible: false,
          headerTitleStyle: FONTS.headerTitle,
          headerTintColor: COLORS.text,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <BackButton onPress={() => router.back()} style={styles.headerButton} iconColor={COLORS.accent} />
          ),
        }}
      />

      <Stack.Screen
        name="language/index"
        options={{
          title: t('profile.changeLanguage').toUpperCase(),
          presentation: 'card',
          headerStyle: { backgroundColor: COLORS.background },
          headerShadowVisible: false,
          headerTitleStyle: FONTS.headerTitle,
          headerTintColor: COLORS.text,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <BackButton onPress={() => router.back()} style={styles.headerButton} iconColor={COLORS.accent} />
          ),
        }}
      />

    </Stack>
  );
}

const styles = StyleSheet.create({
  // iOS wraps native header buttons in its own glass capsule
  headerButton: { backgroundColor: COLORS.transparent },
});
