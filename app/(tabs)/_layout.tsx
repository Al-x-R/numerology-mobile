// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';

// Create a custom button for languages
const LanguageButton = () => {
  // there will be useState(language) and onPress logic here.
  const handleLanguageChange = () => {
    alert('Сменить язык!');
  };

  return (
    <TouchableOpacity onPress={handleLanguageChange} style={{ marginRight: 15 }}>
      {/* Globe icon. Can be replaced with Text with a flag. 🇷🇺/🇺🇸 */}
      <Ionicons name="globe-outline" size={24} color="#E0B873" />
    </TouchableOpacity>
  );
};


export default function TabLayout() {
  const ACCENT_COLOR = '#E0B873';
  const BG_COLOR = '#0D0F21';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACCENT_COLOR,
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: {
          backgroundColor: BG_COLOR,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          height: 90,
          paddingTop: 10,
        },

        headerStyle: {
          backgroundColor: BG_COLOR, // Header background
          borderBottomWidth: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: '#FFFFFF', // Title text color
          fontWeight: 'bold',
          fontSize: 20,
          marginLeft: 15, // Left indentation to prevent sticking together
        },
        headerShadowVisible: false, // Removing the shadow under the header
      }}
    >
      <Tabs.Screen
        name="pythagoras"
        options={{
          title: 'Пифагор', // Text for the bottom tab
          headerShown: true, // Enable the header for this screen
          headerTitle: 'Destiny Code', // Text in the title
          headerTitleAlign: 'left', // Header alignment

          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),

          // Adding our button to the right
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
        name="numbers" // new tab for car/phone
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
