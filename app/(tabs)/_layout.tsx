// app/(tabs)/_layout.tsx — ФИНАЛЬНАЯ ВЕРСИЯ
import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, LAYOUT } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileButton } from '@/components/ui/ProfileButton';
import DrawerOverlay from '@/components/ui/DrawerOverlay'; // ← новый компонент

export default function TabLayout() {
  const { openDrawer } = useProfile();

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
          headerRight: () => <ProfileButton onPress={openDrawer} />,
        }}
      >
        <Tabs.Screen
          name="pythagoras"
          options={{
            title: t('tabs.pythagoras'),
            tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={LAYOUT.iconSize} color={color} />,
          }}
        />
        <Tabs.Screen
          name="compatibility"
          options={{
            title: t('tabs.compatibility'),
            tabBarIcon: ({ color }) => <Ionicons name="heart-outline" size={LAYOUT.iconSize} color={color} />,
          }}
        />
        <Tabs.Screen
          name="numbers"
          options={{
            title: t('tabs.numbers'),
            tabBarIcon: ({ color }) => <Ionicons name="keypad-outline" size={LAYOUT.iconSize} color={color} />,
          }}
        />
      </Tabs>

      <DrawerOverlay />
    </>
  );
}
