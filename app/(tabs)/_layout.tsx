import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const LanguageButton = () => {
  const handleLanguageChange = () => {
    alert('Сменить язык!');
  };

  return (
    <TouchableOpacity onPress={handleLanguageChange} style={{ marginRight: 15 }}>
      <Ionicons name="globe-outline" size={24} color="#E0B873" />
    </TouchableOpacity>
  );
};

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
        headerShadowVisible: false,
        headerTintColor: ACCENT_COLOR,
      }}
    >
      <Tabs.Screen
        name="pythagoras"
        options={{
          title: 'Пифагор',
          headerShown: true,
          headerTitle: 'Destiny Code',
          headerTitleAlign: 'left',
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
          headerRight: () => <LanguageButton />,
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: 'Совместимость',
          headerTitle: 'Destiny Code',
          headerTitleAlign: 'left',
          headerRight: () => <LanguageButton />,
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="numbers"
        options={{
          title: 'Числа',
          headerTitle: 'Destiny Code',
          headerTitleAlign: 'left',
          headerRight: () => <LanguageButton />,
          tabBarIcon: ({ color }) => (
            <Ionicons name="keypad-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
