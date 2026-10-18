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
} as const;

// Dark luxury palette: warm near-black, a single muted gold accent, warm ivory text
export const COLORS = {
  background: '#0E0C0A',
  headerBackground: '#14110E',
  surface: '#17140F',
  card: 'rgba(242, 237, 228, 0.035)',
  cardFocused: 'rgba(201, 169, 110, 0.08)',
  border: 'rgba(242, 237, 228, 0.14)',
  borderFocused: '#C9A96E',
  borderAccent: '#C9A96E',
  hairline: 'rgba(242, 237, 228, 0.08)',
  text: '#F2EDE4',
  blackText: '#14110E',
  textSecondary: '#9C9386',
  textMuted: '#6E665B',
  accent: '#C9A96E',
  accentSoft: 'rgba(201, 169, 110, 0.12)',
  primary: '#C9A96E',
  primaryDark: '#A8874F',
  error: '#C9705E',
  boxShadow: '#000',
  shadowAccent: '#C9A96E',
  // === CELL HIGHLIGHT ===
  highlightWeak: '#B5674D',
  highlightStrong: '#C9A96E',

  battery: {
    empty: '#B5674D',
    full: '#8FA87A',
    light: '#B9C7A8',     // used for the gradient
  },
  textTertiary: '#CFC7BA',
  loading: '#C9A96E',      // ActivityIndicator color

  cardBackground: 'rgba(242, 237, 228, 0.035)',
  cardBorder: 'rgba(242, 237, 228, 0.08)',
  accentCardBackground: 'rgba(201, 169, 110, 0.08)',
  accentCardBorder: 'rgba(201, 169, 110, 0.18)',
  weakHighlightBackground: 'rgba(181, 103, 77, 0.08)',
  strongHighlightBackground: 'rgba(201, 169, 110, 0.08)',
  pulseOverlay: 'rgba(201, 169, 110, 0.15)',
  modalBackdrop: 'rgba(0, 0, 0, 0.8)',
  textShadow: 'rgba(201, 169, 110, 0.35)',
  transparent: 'transparent',
};

export const GRADIENTS = {
  background: ['#16130F', '#0E0C0A'] as const,
  button: ['#D9BE85', '#C9A96E', '#A8874F'] as const,
  buttonLoading: ['#C9A96E', '#A8874F'] as const,
  goldenButton: ['#D9BE85', '#C9A96E', '#A8874F'] as const,
  card: ['#1A1612', '#120F0C'] as const,
  accentCard: ['rgba(201, 169, 110, 0.16)', 'rgba(201, 169, 110, 0.04)'] as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  formGap: 35,
  cardPadding: 15,
  sectionMarginTop: 30,
  subtitleMargin: 5,
  subtitleMarginBottom: 40,
  titleMarginBottom: 10,
  numberCardGap: 5,
  tooltipPadding: 6,
  tooltipPaddingVertical: 2,
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
    shadowColor: COLORS.boxShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  inputFocused: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  button: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  goldenButton: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },

  goldenButtonSoft: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const LAYOUT = {
  formMaxWidth: 450,
  formWidth: '100%' as DimensionValue,
  containerPadding: 50,
  logoSmall: 200,
  logoMedium: 600,
  logoLarge: 700,
  modalMaxWidth: 550,
  contentPadding: 20,
  tabBarHeight: 90,
  tabBarPaddingTop: 10,
  iconSize: 24,
  closeIconSize: 24,
  logoMarginBottom: 30,
  spinnerMarginTop: 20,
  languageButtonMarginRight: 15,
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
    fontFamily: FONT_FAMILY.playfair.regular,
    fontSize: 34,
    letterSpacing: 0.3,
    color: COLORS.text,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 17,
    lineHeight: 26,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.playfair.regular,
    fontSize: 20,
    letterSpacing: 0.3,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
  },
  button: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: COLORS.blackText,
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
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
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
    fontFamily: FONT_FAMILY.playfair.regular,
    fontSize: 24,
    color: COLORS.text,
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
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
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
  body: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },

  link: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 15,
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
};
