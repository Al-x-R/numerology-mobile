import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LanguageButton } from '@/components/ui/LanguageButton';
import { COLORS, FONTS, LAYOUT } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';
import { useProfile } from '@/contexts/ProfileContext';


export default function TabLayout() {
  const ACCENT_COLOR = COLORS.accent;
  const INACTIVE_COLOR = COLORS.textSecondary;
  const BG_COLOR = COLORS.background;

  const { user, isLoading } = useProfile();

  if (isLoading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACCENT_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: BG_COLOR,
          borderTopColor: COLORS.cardBorder,
          height: LAYOUT.tabBarHeight,
          paddingTop: LAYOUT.tabBarPaddingTop,
          position: 'absolute',
        },
        headerStyle: {
          backgroundColor: COLORS.headerBackground,
        },
        headerTitleStyle: {
          ...FONTS.headerTitle,
          marginLeft: LAYOUT.headerTitleMarginLeft,
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
            <Ionicons name="grid-outline" size={LAYOUT.iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: t('tabs.compatibility'),
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={LAYOUT.iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="numbers"
        options={{
          title: t('tabs.numbers'),
          tabBarIcon: ({ color }) => (
            <Ionicons name="keypad-outline" size={LAYOUT.iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
