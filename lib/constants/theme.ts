// constants/theme.ts
import { DimensionValue } from 'react-native';

export const FONT_FAMILY = {
  playfair: {
    bold: 'PlayfairDisplay-Bold',
    regular: 'PlayfairDisplay-Regular',
  },
  manrope: {
    bold: 'Manrope-Bold',
    regular: 'Manrope-Regular',
  },
  cinzel: {
    regular: 'Cinzel-Regular',
  },
} as const;

export const COLORS = {
  background: '#0D0F21',
  headerBackground: '#1A1C33',
  card: 'rgba(255, 255, 255, 0.04)',
  cardFocused: 'rgba(167, 139, 250, 0.08)',
  border: 'rgba(255, 255, 255, 0.2)',
  borderFocused: '#A78BFA', // Использует primary цвет
  borderAccent: '#E0B873',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#E0B873',
  primary: '#A78BFA',
  primaryDark: '#7C3AED',
  error: '#FF6B6B',
  shadow: '#000',
  shadowAccent: '#A78BFA', // Дубликат primary, но оставляем для совместимости
  // === НОВЫЕ: ПОДСВЕТКА ЯЧЕЕК ===
  highlightWeak: '#FF9500',
  highlightStrong: '#8B5CF6',

  battery: {
    empty: '#FF3B30',     // красный — пусто
    full: '#34C759',      // зелёный — полный заряд
    light: '#A8E6A1',     // светло-зелёный (для градиента)
  },
  textTertiary: '#D0D0D0',  // серый для описаний
  loading: '#FFD700',      // золотой для ActivityIndicator
  
  // RGBA значения для прозрачных фонов
  cardBackground: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  accentCardBackground: 'rgba(224, 184, 115, 0.1)',
  accentCardBorder: 'rgba(122, 95, 255, 0.1)',
  weakHighlightBackground: 'rgba(255, 107, 107, 0.08)',
  strongHighlightBackground: 'rgba(139, 92, 246, 0.08)',
  pulseOverlay: 'rgba(224, 184, 115, 0.15)',
  modalBackdrop: 'rgba(0, 0, 0, 0.75)',
  textShadow: 'rgba(167, 139, 250, 0.4)',
  transparent: 'transparent',
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

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  formGap: 35,
  // Дополнительные отступы из компонентов
  cardPadding: 15,
  sectionMarginTop: 30,
  subtitleMargin: 5,
  subtitleMarginBottom: 40,
  titleMarginBottom: 10,
  numberCardGap: 5,
  tooltipPadding: 6,
  tooltipPaddingVertical: 2,
  // Дополнительные отступы
  loadingContentGap: 12,
  cellLabelPaddingTop: 5,
  contentPadding: 20,
};

export const RADIUS = {
  sm: 8,
  md: 10,
  lg: 16,
  xl: 24,
  modal: 20,
  battery: 6,
  batteryCap: 2,
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
  // Размеры из компонентов
  logoSmall: 120,
  logoMedium: 600,
  logoLarge: 700,
  modalMaxWidth: 550,
  contentPadding: 20,
  tabBarHeight: 90,
  tabBarPaddingTop: 10,
  iconSize: 24,
  closeIconSize: 24,
  // Позиционирование
  logoMarginBottom: 30,
  spinnerMarginTop: 20,
  languageButtonMarginRight: 15,
  // Дополнительные размеры
  batteryWidth: 80,
  batteryHeight: 40,
  batteryCapWidth: 8,
  batteryCapHeight: 12,
  paddingRightLarge: 40,
  paddingRightMedium: 30,
  topMarginLarge: 80,
  headerTitleMarginLeft: 15,
};

export const FONTS = {
  title: {
    fontFamily: FONT_FAMILY.playfair.bold,
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    color: COLORS.accent,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.playfair.bold,
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.accent,
  },
  headerSubtitle: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
  },
  button: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    color: COLORS.text,
  },
  input: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center' as const,
  },
  error: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 14,
    fontWeight: '500' as const,
    color: COLORS.error,
    textAlign: 'center' as const,
  },
  loading: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.textSecondary,
  },
  cellLabel: {
    fontFamily: FONT_FAMILY.cinzel.regular,
    fontSize: 12,
    color: COLORS.accent,
  },
  cellValue: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 24,
    color: COLORS.text,
  },
  tooltip: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 9,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  cardTitle: {
    fontFamily: FONT_FAMILY.playfair.bold,
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.accent,
  },
  cardDescription: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 16,
    color: COLORS.textTertiary,
    lineHeight: 24,
  },
  batteryLabel: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  workingLabel: {
    fontFamily: FONT_FAMILY.cinzel.regular,
    fontSize: 12,
    color: COLORS.accent,
  },
  workingValue: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  fateValue: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 30,
    fontWeight: '700' as const,
    color: COLORS.accent,
  },
} as const;

export const FORM_STYLES = {
  subtitle: {
    ...FONTS.subtitle,
    marginTop: SPACING.subtitleMargin,
    marginBottom: SPACING.subtitleMarginBottom,
    textAlign: 'center' as const,
  },
} as const;

// Дополнительные константы для размеров шрифтов
export const FONT_SIZES = {
  screenTitle: 24,
  screenSubtitle: 16,
  cellValueLarge: 32,
  cellValueMedium: 27,
  modalTitle: 22,
  loadingText: 16,
} as const;

// === GRID CELL ANIMATED STYLES ===
export const GRID_CELL_ANIMATED = {
  label: {
    ...FONTS.cellLabel,
    textAlign: 'center' as const,
    paddingTop: SPACING.xs,
  },
  value: (fontSize: number) => ({
    ...FONTS.cellValue,
    fontSize,
    textAlign: 'center' as const,
  }),
  tooltip: {
    text: {
      ...FONTS.tooltip,
      textAlign: 'center' as const,
    },
  },
  container: (cellSize: number) => ({
    width: cellSize,
    borderWidth: 1,
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.cardBorder,
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
      backgroundColor: COLORS.weakHighlightBackground,
    },
    strong: {
      borderColor: COLORS.highlightStrong,
      backgroundColor: COLORS.strongHighlightBackground,
    },
  },

  // Tooltip
  // tooltip: {
  //   wrapper: {
  //     position: 'absolute' as const,
  //     top: -8,
  //     alignItems: 'center' as const,
  //     zIndex: 10,
  //   },
  //   container: (isWeak: boolean) => ({
  //     paddingHorizontal: 6,
  //     paddingVertical: 2,
  //     borderRadius: RADIUS.sm,
  //     minWidth: 50,
  //     alignItems: 'center' as const,
  //     backgroundColor: isWeak ? COLORS.highlightWeak : COLORS.highlightStrong,
  //   }),
  //   text: {
  //     color: COLORS.text,
  //     fontSize: 9,
  //     fontWeight: '600' as const,
  //     fontFamily: 'Manrope-Bold',
  //     textAlign: 'center' as const,
  //   },
  // },
};

