// components/ui/GoldButton.tsx
import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, GRADIENTS, LAYOUT, RADIUS, SHADOWS, SPACING } from '@/lib/constants/theme';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Primary CTA: brushed gold gradient, uppercase label, ambient gold aura
export const GoldButton = ({ title, onPress, icon, loading, disabled, style }: GoldButtonProps) => (
  <TouchableOpacity
    style={[styles.wrapper, (disabled || loading) && styles.disabled, style]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.85}
  >
    <LinearGradient colors={GRADIENTS.button} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradient}>
      {loading ? (
        <ActivityIndicator color={COLORS.blackText} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={styles.label}>{title}</Text>
        </View>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RADIUS.lg,
    ...SHADOWS.button,
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    height: LAYOUT.buttonHeight,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  label: FONTS.button,
});
