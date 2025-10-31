// constants/theme.ts
import { Platform, DimensionValue } from 'react-native';

export const COLORS = {
  background: '#0D0F21',
  card: 'rgba(255, 255, 255, 0.04)',
  cardFocused: 'rgba(167, 139, 250, 0.08)',
  border: 'rgba(255, 255, 255, 0.2)',
  borderFocused: '#A78BFA',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#E0B873',
  primary: '#A78BFA',
  primaryDark: '#7C3AED',
  error: '#FF6B6B',
  shadow: '#000',
  shadowAccent: '#A78BFA',
};

export const GRADIENTS = {
  button: ['#B794F4', '#9F7AEA', '#7C3AED'] as const,
  buttonLoading: ['#9F7AEA', '#7C3AED'] as const,
};
// export const GRADIENTS = {
//   button: ['#4F46E5', '#7C3AED'] as const, // ← as const
//   buttonLoading: ['#6366F1', '#8B5CF6'] as const,
// } satisfies Record<string, readonly [string, string, ...string[]]>;

export const FONTS = {
  bold: Platform.select({ ios: 'Georgia-Bold', android: 'serif' }),
  regular: Platform.select({ ios: 'Georgia', android: 'serif' }),
  systemBold: Platform.select({ ios: 'SFProDisplay-Bold', android: 'sans-serif-medium' }),
  systemRegular: Platform.select({ ios: 'SFProDisplay-Regular', android: 'sans-serif' }),

  title: {
    fontFamily: Platform.select({ ios: 'Georgia-Bold', android: 'serif' }),
    fontSize: 32,
    fontWeight: 'bold' as const,
    letterSpacing: 0.5,
    color: COLORS.accent,
  },
  subtitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
  },
  button: {
    fontFamily: Platform.select({ ios: 'SFProDisplay-Bold', android: 'sans-serif-medium' }),
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    color: COLORS.text,
  },
  input: {
    fontFamily: Platform.select({ ios: 'SFProDisplay-Regular', android: 'sans-serif' }),
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center' as const,
  },
  error: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: COLORS.error,
    textAlign: 'center' as const,
  },
  loading: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  formGap: 35,
};

export const RADIUS = {
  sm: 8,
  md: 10,
  lg: 16,
  xl: 24,
};

export const SHADOWS = {
  card: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFocused: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },
};

export const LAYOUT = {
  formMaxWidth: 450,
  formWidth: '100%' as DimensionValue,
  containerPadding: 50,
};
