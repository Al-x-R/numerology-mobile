// Design tokens built from the Aura Noir palette (see DESIGN.md) by the roles in
// design/mobile-design-rules.md section 2. This is the only place with raw color values:
// lib/constants/theme.ts maps its COLORS / GRADIENTS onto these tokens.
// Contrast is WCAG, measured against bg / card / field.

export const palette = {
  // Surfaces: neutrals tinted toward the gold hue, dark → light
  bg: '#100F0E',
  card: '#171715',
  field: '#201F1D',
  border: '#282724',

  // Text, weakest level still >= 4.5:1 on bg, card and field
  text: '#F8F7F4', // 15.4–17.9
  text2: '#D0CCC4', // 10.3–12.0
  text3: '#9E9B94', // 5.9–6.9
  text4: '#89867D', // 4.5–5.3, placeholders and the faintest captions

  // Brand gold
  accent: '#D4AF37', // fill of primary actions, as text 7.8–9.1
  accentDeep: '#C9A84C', // lower stop of the gold button gradient
  accentPressed: '#B8963F', // gold button while loading
  accentText: '#DFBA54', // gold as text / link, 8.9–10.3
  onAccent: '#100F0E', // text on any gold fill, 8.4–10.3 (white: 1.9–2.3)
  accentSurface: '#1C1914', // selected / highlighted card fill

  // Statuses, each passes as text on surfaces and carries onStatus on its fill
  ok: '#399859', // 4.6–5.3
  warn: '#C59265', // 6.0–7.0, orange so it never reads as the gold accent
  danger: '#C26F6F', // 4.5–5.3
  onStatus: '#100F0E', // on ok / warn / danger fills, >= 5.3 (white: <= 3.6)
  dangerSoft: '#3A2222', // danger chip fill
  onDangerSoft: '#E8A3A3', // text and icons on the danger chip, 7.1

  // Forecast aspect categories (rules 2.5: several hues only for categories), each also has its own icon
  love: '#D28894', // 6.0–7.0
  work: '#7EA0C1', // 6.0–7.0
  health: '#64AC77', // 6.0–7.0

  // Secondary actions and decoration
  ghost: '#928572', // muted warm text for cancel actions, 4.6–5.3
  iconMuted: '#6E6A63', // inactive tab icons, 3.1–3.6
  chevron: '#6D6961', // disclosure chevrons, >= 3:1
  proTop: '#211D16', // premium card gradient
  proBottom: '#151412',

  white: '#FFFFFF',
  black: '#000000',
} as const;

// Builds an rgba() string from a #RRGGBB token, so translucent strokes stay tied to their base color
export const withAlpha = (hex: string, alpha: number): string => {
  const value = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const radius = {
  field: 12,
  card: 16,
  modal: 24,
  pill: 9999,
} as const;

// 4pt spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export type ColorToken = keyof typeof palette;
export type RadiusToken = keyof typeof radius;
export type SpacingToken = keyof typeof spacing;
