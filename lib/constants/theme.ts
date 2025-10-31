// constants/theme.ts
import { Platform, DimensionValue } from 'react-native';

export const COLORS = {
  background: '#0D0F21',
  headerBackground: '#1A1C33',
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
  // === НОВЫЕ: ПОДСВЕТКА ЯЧЕЕК ===
  highlightWeak: '#FF9500',
  highlightStrong: '#8B5CF6',

  battery: {
    empty: '#FF3B30',     // красный — пусто
    full: '#34C759',      // зелёный — полный заряд
    light: '#A8E6A1',     // светло-зелёный (для градиента)
  },
};

export const GRADIENTS = {
  background: ['#1A1C33', '#0D0F21'] as const,
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

// === GRID CELL ANIMATED STYLES ===
export const GRID_CELL_ANIMATED = {
  container: (cellSize: number) => ({
    width: cellSize,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.md,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: SPACING.sm,
    padding: SPACING.xs,
    position: 'relative' as const,
  }),

  // Подсветка
  highlight: {
    weak: {
      borderColor: COLORS.highlightWeak,
      backgroundColor: 'rgba(255, 107, 107, 0.08)',
    },
    strong: {
      borderColor: COLORS.highlightStrong,
      backgroundColor: 'rgba(139, 92, 246, 0.08)',
    },
  },

  // Текст заголовка
  label: {
    fontSize: 12,
    color: COLORS.accent,
    textAlign: 'center' as const,
    paddingTop: SPACING.xs,
    fontFamily: FONTS.systemRegular,
  },

  value: (fontSize: number) => ({
    fontSize,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    fontFamily: FONTS.bold,
    textAlign: 'center' as const,
  }),

  // Tooltip
  tooltip: {
    wrapper: {
      position: 'absolute' as const,
      top: -8,
      alignItems: 'center' as const,
      zIndex: 10,
    },
    container: (isWeak: boolean) => ({
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: RADIUS.sm,
      minWidth: 50,
      alignItems: 'center' as const,
      backgroundColor: isWeak ? COLORS.highlightWeak : COLORS.highlightStrong,
    }),
    text: {
      color: COLORS.text,
      fontSize: 9,
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    },
  },
};
