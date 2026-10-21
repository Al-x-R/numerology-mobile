// components/ui/CardGlow.tsx
// Soft light in a card's top-left corner. The card needs `overflow: 'hidden'` and its own background.
// Used on a screen's main cards only, so the glow keeps meaning "look here first"
import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS } from '@/lib/constants/theme';
import { withAlpha } from '@/src/theme/tokens';

interface CardGlowProps {
  // Gold by default; aspect cards pass their category colour
  color?: string;
  intensity?: number;
}

export const CardGlow = ({ color = COLORS.accent, intensity = 0.08 }: CardGlowProps) => (
  <LinearGradient
    colors={[withAlpha(color, intensity), withAlpha(color, 0)]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0.7, y: 0.6 }}
    style={StyleSheet.absoluteFill}
    pointerEvents="none"
  />
);
