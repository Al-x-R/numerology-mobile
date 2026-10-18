// components/ui/BackButton.tsx

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/lib/constants/theme';

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  iconColor?: string;
  size?: number;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const BackButton = ({
  onPress,
  style,
  iconColor = COLORS.text,
  size = 40,
  icon = 'chevron-back',
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
      {/* marginRight: 2 optically centres the chevron in the circle */}
      <Ionicons
        name={icon}
        size={size * 0.5}
        color={iconColor}
        style={icon === 'chevron-back' ? { marginRight: 2 } : undefined}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Frosted glass navigation control
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.glass,
  },
});
