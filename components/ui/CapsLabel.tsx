// components/ui/CapsLabel.tsx
// Tracked capital labels, set in EB Garamond for every script so the app stays within two font families
import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { FONT_FAMILY } from '@/lib/constants/theme';

type Weight = 'medium' | 'semibold';

export const capsFontFamily = (weight: Weight = 'semibold'): string => FONT_FAMILY.serif[weight];

interface CapsLabelProps {
  children: string;
  style?: StyleProp<TextStyle>;
  weight?: Weight;
}

export const CapsLabel = ({ children, style, weight }: CapsLabelProps) => (
  <Text style={[style, { fontFamily: capsFontFamily(weight) }]}>{children}</Text>
);
