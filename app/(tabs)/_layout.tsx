// app/(tabs)/_layout.tsx
import { router, Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, LAYOUT, TYPE } from '@/lib/constants/theme';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { HeaderEmblem } from '@/components/ui/HeaderEmblem';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { TAB_BAR_STYLE } from '@/lib/constants/navigation';

// Frosted glass bar with a gold hairline fading out to the edges
const TabBarBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <BlurView intensity={40} tint="dark" style={[StyleSheet.absoluteFill, styles.glass]} />
    <LinearGradient colors={GRADIENTS.goldHairline} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.hairline} />
  </View>
);

export default function TabLayout() {
  const { t } = useAppTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.iconInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: TAB_BAR_STYLE,
        headerStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        headerTintColor: COLORS.text,
        headerTitleStyle: FONTS.headerTitle,
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderEmblem />,
        headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: t('tabs.today'),
          tabBarLabel: t('tabs.short.today'),
          tabBarIcon: ({ color }) => <Ionicons name="sunny-outline" size={LAYOUT.iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pythagoras"
        options={{
          title: t('tabs.pythagoras'),
          tabBarLabel: t('tabs.short.pythagoras'),
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={LAYOUT.iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: t('tabs.compatibility'),
          tabBarLabel: t('tabs.short.compatibility'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="infinity" size={LAYOUT.iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="numbers"
        options={{
          title: t('tabs.numbers'),
          tabBarLabel: t('tabs.short.numbers'),
          tabBarIcon: ({ color }) => <Ionicons name="sparkles-outline" size={LAYOUT.iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="horoscope"
        options={{
          title: t('tabs.horoscope'),
          tabBarLabel: t('tabs.short.horoscope'),
          tabBarIcon: ({ color }) => <Ionicons name="moon-outline" size={LAYOUT.iconSize} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: 'rgba(14, 14, 14, 0.8)',
  },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  tabLabel: {
    ...TYPE.labelSm,
    letterSpacing: 1,
    marginTop: 2,
  },
});
