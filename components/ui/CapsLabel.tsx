// components/ui/CapsLabel.tsx
// Tracked capital labels: Cinzel has no Cyrillic, so Cyrillic text is set in EB Garamond instead
import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { FONT_FAMILY } from '@/lib/constants/theme';

const CYRILLIC = /[Ѐ-ӿ]/;

type Weight = 'medium' | 'semibold';

export const capsFontFamily = (text: string, weight: Weight = 'semibold'): string =>
  CYRILLIC.test(text) ? FONT_FAMILY.serif[weight] : FONT_FAMILY.cinzel[weight];

interface CapsLabelProps {
  children: string;
  style?: StyleProp<TextStyle>;
  weight?: Weight;
}

export const CapsLabel = ({ children, style, weight }: CapsLabelProps) => (
  <Text style={[style, { fontFamily: capsFontFamily(children, weight) }]}>{children}</Text>
);
