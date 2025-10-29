import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LanguageButton } from '@/components/ui/LanguageButton';


export default function TabLayout() {
  const ACCENT_COLOR = '#E0B873';
  const INACTIVE_COLOR = '#A0A0A0';
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
          backgroundColor: '#1A1C33',
        },
        headerTitleStyle: {
          color: ACCENT_COLOR,
          fontWeight: 'bold',
          fontSize: 20,
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
          title: 'Психоматрица',
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: 'Совместимость',
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="numbers"
        options={{
          title: 'Числа',
          tabBarIcon: ({ color }) => (
            <Ionicons name="keypad-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
