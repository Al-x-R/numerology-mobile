// constants/theme.ts
import { Platform } from 'react-native';

export const COLORS = {
  background: '#0D0F21',
  card: 'rgba(255, 255, 255, 0.04)',
  border: 'rgba(255, 255, 255, 0.2)',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#E0B873',
  primary: '#A78BFA',
  primaryDark: '#7C3AED',
  error: '#FF6B6B',
  shadow: '#000',
};

export const GRADIENTS = {
  button: ['#B794F4', '#9F7AEA', '#7C3AED'],
  buttonLoading: ['#9F7AEA', '#7C3AED'],
};

export const FONTS = {
  bold: Platform.select({
    ios: 'Georgia-Bold',
    android: 'serif',
  }),
  regular: Platform.select({
    ios: 'Georgia',
    android: 'serif',
  }),
  title: {
    fontFamily: Platform.select({
      ios: 'Georgia-Bold',
      android: 'serif',
    }),
    fontSize: 32,
    fontWeight: 'bold' as const,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
    }),
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  button: {
    fontFamily: Platform.select({
      ios: 'SFProDisplay-Bold',
      android: 'sans-serif-medium',
    }),
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  input: {
    fontFamily: Platform.select({
      ios: 'SFProDisplay-Regular',
      android: 'sans-serif',
    }),
    fontSize: 18,
  },
};
