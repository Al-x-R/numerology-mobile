import { Redirect, Tabs } from 'expo-router';
import React, {  } from 'react';
import {
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, LAYOUT, SPACING } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';
import { useProfile } from '@/contexts/ProfileContext';
import ProfileDrawer from '@/components/ui/ProfileDrawer';
import { ProfileButton } from '@/components/ui/ProfileButton';

export default function TabLayout() {
  const ACCENT_COLOR = COLORS.accent;
  const INACTIVE_COLOR = COLORS.textSecondary;
  const BG_COLOR = COLORS.background;

  const { user, isLoading, isDrawerVisible, setDrawerVisible } = useProfile();

  if (isLoading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <>
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

          headerRight: () => <ProfileButton />
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
              <Ionicons
                name="heart-outline"
                size={LAYOUT.iconSize}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="numbers"
          options={{
            title: t('tabs.numbers'),
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="keypad-outline"
                size={LAYOUT.iconSize}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      <Modal
        visible={isDrawerVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setDrawerVisible(false)}
      >
        <ProfileDrawer onClose={() => setDrawerVisible(false)} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: SPACING.md,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
});
