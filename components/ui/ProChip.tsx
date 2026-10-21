// components/ui/ProChip.tsx
// Marks a PRO-only feature in list rows: text says what unlocks it, unlike a bare lock icon
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';

export const ProChip = () => (
  <View style={styles.chip}>
    <Text style={styles.text}>PRO</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    color: COLORS.accent,
    letterSpacing: 1,
  },
});
