// app/(tabs)/_layout.tsx
import { router, Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, LAYOUT } from '@/lib/constants/theme';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { useAppTranslation } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { t } = useAppTranslation();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: {
            backgroundColor: COLORS.background,
            borderTopColor: COLORS.cardBorder,
            height: LAYOUT.tabBarHeight,
            paddingTop: LAYOUT.tabBarPaddingTop,
          },
          headerStyle: { backgroundColor: COLORS.headerBackground },
          headerTintColor: COLORS.accent,
          headerTitleAlign: 'center',
          headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
        }}
      >
        <Tabs.Screen
          name="pythagoras"
          options={{
            title: t('tabs.pythagoras'),
            tabBarIcon: ({ color }) => <Ionicons name="apps-outline" size={LAYOUT.iconSize} color={color} />,
          }}
        />
        <Tabs.Screen
          name="compatibility"
          options={{
            title: t('tabs.compatibility'),
            tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={LAYOUT.iconSize} color={color} />,
          }}
        />
        <Tabs.Screen
          name="numbers"
          options={{
            title: t('tabs.numbers'),
            tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={LAYOUT.iconSize} color={color} />,
          }}
        />

        <Tabs.Screen
          name="horoscope"
          options={{
            title: t('tabs.horoscope'),
            tabBarIcon: ({ color }) => <Ionicons name="moon-outline" size={LAYOUT.iconSize} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
