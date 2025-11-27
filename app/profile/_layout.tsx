// app/(app)/profile/_layout.tsx
import { router, Stack } from 'expo-router';
import { t } from '@/lib/constants/locales';
import { COLORS } from '@/lib/constants/theme';
import { BackButton } from '@/components/ui/BackButton';
import React from 'react';

export default function ProfileLayout() {
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
    </Stack>
  );
}
