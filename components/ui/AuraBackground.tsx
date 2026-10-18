// components/ui/AuraBackground.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { COLORS } from '@/lib/constants/theme';

// Obsidian canvas with a faint gold glow: radial-gradient(circle at 50% 45%, rgba(201, 168, 76, 0.08), transparent 70%)
export const AuraBackground = ({ glow = true }: { glow?: boolean }) => (
  <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.background }]} pointerEvents="none">
    {glow && (
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="aura" cx="50%" cy="45%" r="70%">
            <Stop offset="0" stopColor={COLORS.accentAmber} stopOpacity={0.08} />
            <Stop offset="1" stopColor={COLORS.accentAmber} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#aura)" />
      </Svg>
    )}
  </View>
);
