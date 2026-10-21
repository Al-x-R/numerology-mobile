import { DimensionValue } from 'react-native';

import { palette, withAlpha } from '@/src/theme/tokens';

// Aura Noir design system, see DESIGN.md
export const FONT_FAMILY = {
  serif: {
    medium: 'EBGaramond_500Medium',
    semibold: 'EBGaramond_600SemiBold',
    italic: 'EBGaramond_500Medium_Italic',
  },
  sans: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
  },
} as const;

export const COLORS = {
  // Canvas and surfaces
  background: palette.bg,
  headerBackground: withAlpha(palette.bg, 0.85),
  surface: palette.card,
  surfaceRaised: palette.field,
  surfaceSelected: palette.accentSurface,
  card: palette.card,
  cardFocused: palette.accentSurface,

  // Gold hierarchy
  accent: palette.accent,
  accentAmber: palette.accentDeep,
  accentLight: palette.accentText,
  accentSoft: withAlpha(palette.accentDeep, 0.12),
  primary: palette.accent,
  primaryDark: palette.accentDeep,

  // Strokes
  border: withAlpha(palette.accentDeep, 0.18),
  borderSubtle: withAlpha(palette.accentDeep, 0.12),
  borderFocused: palette.accent,
  borderSelected: withAlpha(palette.accent, 0.85),
  borderAccent: withAlpha(palette.accent, 0.5),
  hairline: withAlpha(palette.white, 0.08),
  divider: withAlpha(palette.white, 0.04),

  // Typography and icons
  text: palette.text,
  textSecondary: palette.text3,
  textMuted: palette.text4,
  textTertiary: palette.text2,
  placeholder: palette.text4,
  iconInactive: palette.iconMuted,
  chevron: palette.chevron,
  blackText: palette.onAccent,

  error: palette.danger,
  warning: palette.warn,

  // Forecast aspect categories
  categoryLove: palette.love,
  categoryWork: palette.work,
  categoryHealth: palette.health,
  warningChip: palette.dangerSoft,
  warningChipText: palette.onDangerSoft,
  ghost: palette.ghost,
  boxShadow: palette.black,
  shadowAccent: palette.accent,

  // Pythagoras matrix cell highlight
  highlightWeak: palette.danger,
  highlightStrong: palette.accent,

  battery: {
    empty: palette.danger,
    full: palette.accent,
    light: palette.accentText, // used for the gradient
  },
  loading: palette.accent, // ActivityIndicator color

  cardBackground: palette.card,
  cardBorder: withAlpha(palette.white, 0.08),
  accentCardBackground: palette.accentSurface,
  accentCardBorder: withAlpha(palette.accent, 0.5),
  weakHighlightBackground: withAlpha(palette.danger, 0.08),
  strongHighlightBackground: palette.accentSurface,
  pulseOverlay: withAlpha(palette.accent, 0.15),
  modalBackdrop: withAlpha(palette.black, 0.8),
  glass: withAlpha(palette.white, 0.06),
  textShadow: withAlpha(palette.accent, 0.35),
  transparent: 'transparent',
};

export const GRADIENTS = {
  background: [palette.bg, palette.bg] as const,
  button: [palette.accentText, palette.accentDeep] as const,
  buttonLoading: [palette.accentDeep, palette.accentPressed] as const,
  goldenButton: [palette.accentText, palette.accentDeep] as const,
  card: [palette.field, palette.card] as const,
  accentCard: [withAlpha(palette.accent, 0.14), withAlpha(palette.accent, 0.02)] as const,
  proCard: [palette.proTop, palette.proBottom] as const,
  goldHairline: ['transparent', withAlpha(palette.accent, 0.3), 'transparent'] as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 36,
  gutter: 16,
  gutterSm: 12,
  margin: 20,
  formGap: 24,
  cardPadding: 16,
  sectionMarginTop: 36,
  subtitleMargin: 4,
  subtitleMarginBottom: 36,
  titleMarginBottom: 8,
  numberCardGap: 12,
  tooltipPadding: 6,
  tooltipPaddingVertical: 2,
  loadingContentGap: 12,
  cellLabelPaddingTop: 4,
  contentPadding: 20,
};

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
  modal: 24,
  battery: 6,
  batteryCap: 2,
};

export const SHADOWS = {
  card: {
    shadowColor: COLORS.boxShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  inputFocused: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  // Primary CTA aura: 0 8px 24px rgba(212, 175, 55, 0.22)
  button: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
  },
  goldenButton: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
  },
  goldenButtonSoft: {
    shadowColor: COLORS.accentAmber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
  tabBarHeight: 64,
  tabBarPaddingTop: 6,
  buttonHeight: 54,
  iconButton: 40,
  iconBadge: 32,
  minTouch: 44,
  emblemSm: 44,
  emblem: 52,
  emblemHero: 64,
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

// Type scale from DESIGN.md (em tracking converted to px)
export const TYPE = {
  displayLg: { fontFamily: FONT_FAMILY.serif.medium, fontSize: 30, lineHeight: 38, letterSpacing: -0.3, color: COLORS.text },
  headlineLg: { fontFamily: FONT_FAMILY.serif.medium, fontSize: 26, lineHeight: 34, letterSpacing: 0.26, color: COLORS.text },
  headlineMd: { fontFamily: FONT_FAMILY.serif.medium, fontSize: 22, lineHeight: 28, letterSpacing: 0.44, color: COLORS.text },
  titleLg: { fontFamily: FONT_FAMILY.sans.semibold, fontSize: 18, lineHeight: 24, letterSpacing: 0.18, color: COLORS.text },
  titleMd: { fontFamily: FONT_FAMILY.sans.semibold, fontSize: 16, lineHeight: 22, letterSpacing: 0.32, color: COLORS.text },
  bodyLg: { fontFamily: FONT_FAMILY.sans.regular, fontSize: 16, lineHeight: 24, color: COLORS.text },
  bodyMd: { fontFamily: FONT_FAMILY.sans.regular, fontSize: 14, lineHeight: 20, letterSpacing: 0.14, color: COLORS.textSecondary },
  bodySm: { fontFamily: FONT_FAMILY.sans.regular, fontSize: 12, lineHeight: 16, letterSpacing: 0.24, color: COLORS.textSecondary },
  labelLg: { fontFamily: FONT_FAMILY.sans.bold, fontSize: 13, lineHeight: 18, letterSpacing: 1.56, textTransform: 'uppercase' as const, color: COLORS.accent },
  labelMd: { fontFamily: FONT_FAMILY.sans.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 1.1, textTransform: 'uppercase' as const, color: COLORS.textSecondary },
  // Hero number of a screen (rules: 40–56, heaviest weight); semibold is the heaviest loaded serif.
  // Add fontVariant: ['tabular-nums'] at the call site, a readonly tuple here does not type-check as TextStyle
  heroNumber: { fontFamily: FONT_FAMILY.serif.semibold, fontSize: 40, lineHeight: 48, color: COLORS.accent },
  labelSm: { fontFamily: FONT_FAMILY.sans.medium, fontSize: 10, lineHeight: 12, letterSpacing: 0.8, textTransform: 'uppercase' as const, color: COLORS.textSecondary },
} as const;

export const FONTS = {
  title: TYPE.displayLg,
  subtitle: { ...TYPE.bodyLg, color: COLORS.textSecondary, textAlign: 'center' as const },
  headerTitle: { ...TYPE.titleMd, letterSpacing: 1.6, textTransform: 'uppercase' as const },
  headerSubtitle: { ...TYPE.bodyMd, textAlign: 'center' as const },
  button: { ...TYPE.labelLg, fontSize: 14, letterSpacing: 1.8, color: COLORS.blackText },
  input: { ...TYPE.titleLg, textAlign: 'center' as const },
  error: { ...TYPE.bodyMd, color: COLORS.error, textAlign: 'center' as const },
  loading: TYPE.bodyMd,
  cellLabel: TYPE.labelMd,
  cellValue: { fontFamily: FONT_FAMILY.serif.medium, fontSize: 32, color: COLORS.text },
  tooltip: TYPE.labelSm,
  cardTitle: TYPE.headlineLg,
  cardDescription: { ...TYPE.bodyLg, color: COLORS.textTertiary },
  batteryLabel: TYPE.labelMd,
  sectionTitle: TYPE.headlineMd,
  workingLabel: TYPE.labelMd,
  workingValue: { fontFamily: FONT_FAMILY.sans.bold, fontSize: 22, color: COLORS.accent },
  fateValue: { fontFamily: FONT_FAMILY.serif.medium, fontSize: 30, color: COLORS.accent },
  body: TYPE.bodyLg,
  link: TYPE.labelLg,
} as const;

export const FORM_STYLES = {
  // Input fields: surface fill, hairline gold border, centered tracked text
  input: {
    ...TYPE.titleLg,
    height: 56,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    textAlign: 'center' as const,
    letterSpacing: 2,
    includeFontPadding: false,
  },
  inputFocused: {
    borderColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  fieldLabel: {
    ...TYPE.labelMd,
    marginBottom: SPACING.sm,
    textAlign: 'center' as const,
  },
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
  cellValueMedium: 28,
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
    borderRadius: RADIUS.lg,
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
      borderColor: COLORS.borderSelected,
      backgroundColor: COLORS.strongHighlightBackground,
    },
  },
};
