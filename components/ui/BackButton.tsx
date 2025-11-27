// components/ui/BackButton.tsx

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  iconColor?: string;
  size?: number;
}

export const BackButton = ({
  onPress,
  style,
  iconColor = '#fff',
  size = 35
}: BackButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* marginRight: 2 — for optical centering of the chevron in the circle */}
      <Ionicons
        name="chevron-back"
        size={size * 0.55}
        color={iconColor}
        style={{ marginRight: 2 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // Glass effect (Glassmorphism)
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    // Volume shadows
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
