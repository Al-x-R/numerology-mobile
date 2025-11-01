import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LanguageButton } from '@/components/ui/LanguageButton';
import { COLORS, FONTS } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';


export default function TabLayout() {
  const ACCENT_COLOR = COLORS.accent;
  const INACTIVE_COLOR = COLORS.textSecondary;
  const BG_COLOR = '#0D0F21';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACCENT_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: BG_COLOR,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          height: 90,
          paddingTop: 10,
          position: 'absolute',
        },
        headerStyle: {
          backgroundColor: COLORS.headerBackground,
        },
        headerTitleStyle: {
          ...FONTS.headerTitle,
          marginLeft: 15,
        },
        headerShadowVisible: true,
        headerTintColor: ACCENT_COLOR,
        headerTitleAlign: 'center',
        // headerTitle: 'Destiny Code',
        headerRight: () => <LanguageButton />,
      }}
    >
      <Tabs.Screen
        name="pythagoras"
        options={{
          title: t('tabs.pythagoras'),
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: t('tabs.compatibility'),
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="numbers"
        options={{
          title: t('tabs.numbers'),
          tabBarIcon: ({ color }) => (
            <Ionicons name="keypad-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
