// app/profile/_layout.tsx
import { router, Stack, useNavigation } from 'expo-router';
import { COLORS } from '@/lib/constants/theme';
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
          title: t('profile.title'),
          headerStyle: { backgroundColor: COLORS.headerBackground },
          headerTintColor: COLORS.accent,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <BackButton onPress={() => router.back()} style={{ marginLeft: 0 }} />
          ),
        }}
      />

      <Stack.Screen
        name="edit"
        options={{
          title: t('profile.editProfile'),
          presentation: 'card',
          headerStyle: { backgroundColor: COLORS.headerBackground },
          headerTintColor: COLORS.accent,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <BackButton onPress={() => router.back()} style={{ marginLeft: 0 }} />
          ),
        }}
      />

      <Stack.Screen
        name="language/index"
        options={{
          title: t('profile.changeLanguage'),
          presentation: 'card',
          headerStyle: { backgroundColor: COLORS.headerBackground },
          headerTintColor: COLORS.accent,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <BackButton onPress={() => router.back()} style={{ marginLeft: 0 }} />
          ),
        }}
      />

    </Stack>
  );
}
