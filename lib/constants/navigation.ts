// lib/constants/navigation.ts
import { COLORS, LAYOUT } from '@/lib/constants/theme';

// Screens toggle the tab bar via setOptions, so they need the same style as the layout
export const TAB_BAR_STYLE = {
  display: 'flex' as const,
  backgroundColor: COLORS.background,
  borderTopWidth: 0,
  height: LAYOUT.tabBarHeight + 24,
  paddingTop: LAYOUT.tabBarPaddingTop,
};
