// components/ui/GoldButton.tsx
import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, GRADIENTS, LAYOUT, RADIUS, SHADOWS, SPACING } from '@/lib/constants/theme';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  // Trailing icon, e.g. a forward arrow after the label
  iconRight?: React.ReactNode;
  loading?: boolean;
  // Shown next to the spinner while loading, e.g. "Calculating..."
  loadingTitle?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// The one primary CTA of the app: deep gold gradient, uppercase label, soft aura, press scale 0.97
export const GoldButton = ({ title, onPress, icon, iconRight, loading, loadingTitle, disabled, style }: GoldButtonProps) => {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.wrapper, disabled && styles.disabled, pressStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => scale.set(withSpring(0.97))}
        onPressOut={() => scale.set(withSpring(1))}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
      >
        <LinearGradient colors={GRADIENTS.button} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradient}>
          <View style={styles.content}>
            {loading ? <ActivityIndicator color={COLORS.blackText} /> : icon}
            {(!loading || loadingTitle) && (
              <Text style={styles.label} numberOfLines={1}>{loading ? loadingTitle : title}</Text>
            )}
            {!loading && iconRight}
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

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
